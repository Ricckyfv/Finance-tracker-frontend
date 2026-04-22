import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category/category.service';
import { BudgetService } from '../../../core/services/budget/budget.service';
import { Category } from '../../../core/models/category.models';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-form.component.html'
})
export class BudgetFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private budgetService = inject(BudgetService);

  @Input() type:'EXPENSE' = 'EXPENSE'; // Solo traemos categorías de Gasto para los presupuestos
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // Valores por defecto: Mes y Año actual
  currentMonth = new Date().getMonth() + 1;
  currentYear = new Date().getFullYear();

  budgetForm: FormGroup = this.fb.group({
    categoryId: ['', Validators.required],
    amountLimit: ['', [Validators.required, Validators.min(1)]],
    month: [this.currentMonth, Validators.required],
    year: [this.currentYear, Validators.required]
  });

  categories: Category[] = [];

  // Control del dropdown personalizado
  isDropdownOpen = false;
  selectedCategory: Category | null = null;

    ngOnInit() {
    this.categoryService.getCategories().subscribe({
    next: (data) => {

      //Solo nos quedamos con las que coincidan con el tipo de modal abierto
      const filteredCategories = data.filter(c => c.type === this.type && c.name.toLocaleLowerCase() != "ahorros");

      //Ahora solo ordena las que pasaron el filtro
      this.categories = filteredCategories.sort((a, b) => {

        // Si estamos en GASTOS, tiramos "Otros Gastos" al final
        if (a.name === 'Otros Gastos') return 1;
        if (b.name === 'Otros Gastos') return -1;

        // Si estamos en INGRESOS, tiramos "Otros Ingresos" al final
        if (a.name === 'Otros Ingresos' || a.name === 'Regalos / Otros') return 1;
        if (b.name === 'Otros Ingresos' || b.name === 'Regalos / Otros') return -1;

        // El resto se ordena de la A a la Z
        return a.name.localeCompare(b.name);
      });
    },
    error: (err) => console.error('Error cargando categorías', err)
  });
  }

  // ==========================================
  // LÓGICA DEL SELECT CUSTOMIZADO
  // ==========================================
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
    this.budgetForm.patchValue({ categoryId: cat.id });
    this.isDropdownOpen = false;
  }

  // Método para obtener el icono correcto
  getCategoryIcon(categoryName: string): string {
    if (!categoryName) return 'paid';
    const name = categoryName.toLowerCase();

    if (name.includes('vivienda')) return 'home';
    if (name.includes('transporte')) return 'directions_car';
    if (name.includes('servicios')) return 'lightbulb';
    if (name.includes('deudas')) return 'credit_card';
    if (name.includes('viajes')) return 'flight_takeoff';
    if (name.includes('ahorro') || name.includes('meta')) return 'savings';
    if (name.includes('salario') || name.includes('ingreso')) return 'payments';
    if (name.includes('comida') || name.includes('restaurante')) return 'restaurant';
    if (name.includes('ocio')) return 'movie';
    if (name.includes('salud')) return 'medical_services';

    return 'shopping_bag';
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      this.budgetService.createBudget(this.budgetForm.value).subscribe({
        next: () => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => alert('Error al crear presupuesto: ' + err.message)
      });
    }
  }
}
