import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetFormComponent } from '../budget-form/budget-form.component';
import { BudgetService } from '../../../core/services/budget/budget.service';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { forkJoin } from 'rxjs'; // Para hacer varias peticiones a la vez
import { ConfirmDeleteModalComponent } from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';

// Interfaz para la tarjeta dibujada en pantalla
export interface BudgetProgress {
  id: number;
  categoryName: string;
  icon: string;
  limit: number;
  spent: number;
  percentage: number;
  statusText: string;
  colorClass: string;
  barClass: string;
}

export interface BudgetInsight {
  title: string;
  description: string;
  icon: string;
  iconClass: string;
}

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule, BudgetFormComponent, ConfirmDeleteModalComponent],
  templateUrl: './budget-list.component.html'
})
export class BudgetListComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);

  showModal = false;
  budgetCards: BudgetProgress[] = [];
  budgetToDeleteId: number | null = null;
  isDeleting = false;

  projectionText: string = '';
  projectionSavings: number = 0;
  insights: BudgetInsight[] = [];
  chartBars: { height: string, opacity: string }[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Pedimos las tres cosas a la vez a Spring Boot
    forkJoin({
      budgets: this.budgetService.getBudgets(),
      transactions: this.transactionService.getMyTransactions(),
      categories: this.categoryService.getCategories()
    }).subscribe(({ budgets, transactions, categories }) => {

      // --- PASO 1: Filtrar datos del mes actual ---
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const currentBudgets = budgets.filter(b => b.month === currentMonth && b.year === currentYear);
      const currentExpenses = transactions.filter(t => t.categoryType === 'EXPENSE');

      // --- PASO 2: Construir las tarjetas ---
      this.budgetCards = currentBudgets.map(budget => {
        const catId = budget.category ? budget.category.id : budget.categoryId;
        const catName = budget.category ? budget.category.name : 'Desconocido';

        const spent = currentExpenses
          .filter(t => t.categoryId === catId || (t as any).category?.id === catId)
          .reduce((sum, tx) => sum + tx.amount, 0);

        const limit = budget.amountLimit;
        const rawPercentage = (spent / limit) * 100;
        const percentage = rawPercentage > 100 ? 100 : rawPercentage;

        let statusText = 'Óptimo';
        let colorClass = 'text-emerald-600 bg-secondary-container/20';
        let barClass = 'bg-secondary';

        if (rawPercentage >= 100) {
          statusText = 'Excedido';
          colorClass = 'text-white bg-error';
          barClass = 'bg-error';
        } else if (rawPercentage >= 80) {
          statusText = 'Peligro';
          colorClass = 'text-error bg-error-container/20';
          barClass = 'bg-error';
        } else if (rawPercentage >= 50) {
          statusText = 'Aceptable';
          colorClass = 'text-on-surface-variant bg-surface-container-high';
          barClass = 'bg-primary';
        }

        const icon = this.getIconForCategory(catName);
        return {id: budget.id!, categoryName: catName, icon, limit, spent, percentage, statusText, colorClass, barClass };
      });

      this.budgetCards.sort((a, b) => b.percentage - a.percentage);

      // --- PASO 3: Cálculo de Proyección Global ---
      const totalLimit = currentBudgets.reduce((sum, b) => sum + b.amountLimit, 0);
      const totalSpent = currentExpenses.reduce((sum, tx) => sum + tx.amount, 0);

      const now = new Date();
      const dayOfMonth = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      const dailyAverage = totalSpent / dayOfMonth;
      const projectedTotal = dailyAverage * daysInMonth;

      if (totalLimit > 0) {
        const diffPercentage = ((totalLimit - projectedTotal) / totalLimit) * 100;
        this.projectionSavings = Math.abs(Math.round(diffPercentage));

        if (projectedTotal <= totalLimit) {
          this.projectionText = `Nuestro algoritmo predice que te mantendrás un ${this.projectionSavings}% por debajo del presupuesto global si mantienes este ritmo los ${daysInMonth - dayOfMonth} días restantes.`;
        } else {
          this.projectionText = `¡Cuidado! Si sigues gastando a este ritmo, podrías exceder tu presupuesto total por un ${this.projectionSavings}%. Intenta reducir gastos no esenciales.`;
        }
      } else {
        this.projectionText = 'Aún no tienes límites de presupuesto para calcular una proyección. ¡Añade uno!';
      }

      // --- PASO 4: Generación de Observaciones (Insights) ---
      this.insights = [];

      // Categorías críticas (más del 85%)
      this.budgetCards.filter(c => c.percentage >= 85).forEach(c => {
        this.insights.push({
          title: `Límite de ${c.categoryName}`,
          description: `Has consumido el ${Math.round(c.percentage)}% de tu presupuesto. Evita gastos extra aquí.`,
          icon: 'warning',
          iconClass: 'text-error'
        });
      });

      // Categorías saludables (menos del 30% a mitad de mes)
      if (dayOfMonth > 15) {
        this.budgetCards.filter(c => c.percentage < 30).forEach(c => {
          this.insights.push({
            title: `Buen ritmo en ${c.categoryName}`,
            description: `Vas muy bien este mes. Tienes margen para reasignar este dinero si lo necesitas.`,
            icon: 'thumb_up',
            iconClass: 'text-secondary'
          });
        });
      }

      // --- PASO 5: Gráfica Dinámica (Simulación) ---
      this.chartBars = Array.from({ length: 8 }).map((_, i) => ({
        height: i < 4 ? `${40 + (Math.random() * 50)}%` : `${20 + (Math.random() * 30)}%`,
        opacity: i < 4 ? 'opacity-100' : 'opacity-40'
      }));

    });
  }

  // Pequeño diccionario de iconos
  getIconForCategory(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('comida') || n.includes('restaurante')) return 'restaurant';
    if (n.includes('casa') || n.includes('vivienda') || n.includes('hogar')) return 'home';
    if (n.includes('ocio') || n.includes('cine') || n.includes('suscripciones')) return 'movie';
    if (n.includes('transporte') || n.includes('coche') || n.includes('gasolina')) return 'commute';
    if (n.includes('salud') || n.includes('farmacia')) return 'medical_services';
    return 'account_balance_wallet'; // Icono por defecto
  }


  // Función para eliminar un presupuesto (con confirmación)
  // 1. El botón de la papelera llama a esta función
  openDeleteConfirm(id: number) {
    this.budgetToDeleteId = id;
  }

  // 2. El botón "Cancelar" del modal llama a esta función
  cancelDelete() {
    this.budgetToDeleteId = null;
  }

  // 3. El botón "Sí, eliminar" del modal llama a esta función
  confirmDelete() {
    if (this.budgetToDeleteId !== null) {
      this.budgetService.deleteBudget(this.budgetToDeleteId).subscribe({
        next: () => {
          this.isDeleting = false;
          this.budgetToDeleteId = null; // Cerramos el modal
          this.loadData();              // Recargamos las tarjetas
        },
        error: (err) => {
          alert('Error al borrar el presupuesto: ' + err.message);
          this.isDeleting = false;
          this.budgetToDeleteId = null;
        }
      });
    }
  }
}
