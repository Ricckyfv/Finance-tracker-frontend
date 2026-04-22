import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category/category.service';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { Category } from '../../../core/models/category.models';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);

  @Input() type: 'INCOME' | 'EXPENSE' = 'EXPENSE'; // Recibe si es Gasto o Ingreso
  @Output() close = new EventEmitter<void>();      // Evento para cerrar el modal
  @Output() saved = new EventEmitter<void>();     // Evento para avisar que se guardó

  transactionForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]],
    categoryId: ['', [Validators.required]],
    transactionDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
    recurring: [false]
  });

  categories: Category[] = [];

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

  onSubmit() {
    if (this.transactionForm.valid) {
      this.transactionService.createTransaction(this.transactionForm.value).subscribe({
        next: () => {
          this.saved.emit();
          this.close.emit();
        },
        error: (err) => alert('Error al guardar: ' + err.error?.message)
      });
    }
  }
}
