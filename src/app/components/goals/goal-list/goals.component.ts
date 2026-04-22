import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { FormsModule } from '@angular/forms';

import { GoalService } from '../../../core/services/goal/goal.service';
import { GoalFormComponent } from '../goal-form/goal-form.component';
import { GoalAddFundsComponent } from '../goal-add-funds/goal-add-funds.component';
import { ConfirmDeleteModalComponent } from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, FormsModule, GoalFormComponent, GoalAddFundsComponent, ConfirmDeleteModalComponent],
  templateUrl: './goals.component.html'
})
export class GoalsComponent implements OnInit {
  private goalService = inject(GoalService);

  // --- ESTADO DEL COMPONENTE ---
  goals: any[] = [];
  totalSaved: number = 0;
  totalTarget: number = 0;
  totalPercentage: number = 0;

  // --- CONTROL DE MODALES ---
  goalToDeleteId: number | null = null;
  selectedGoalId: number | null = null;
  showGoalModal = false;
  isDeletingGoal = false;

  // Definimos la paleta estricta de la aplicación para asegurar consistencia visual
  private categoryColors: { [key: string]: string } = {
    'AHORRO': '#435b9f',
    'FONDO_EMERGENCIA': '#006d36',
    'VIVIENDA': '#f59e0b',
    'TRANSPORTE': '#0ea5e9',
    'VIAJE': '#f59e0b',
    'EDUCACION': '#8b5cf6',
    'COMPRA_IMPORTANTE': '#a16207',
    'INVERSION': '#10b981',
    'OTROS': '#64748b'
  };

  // --- CONFIGURACIÓN DE GRÁFICOS ---
  public pieChartType: 'pie' = 'pie';
  public pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#00113a',
        titleFont: { family: 'Manrope', size: 14 },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed as number;
            return ` ${label}: $${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  ngOnInit() {
    this.loadMyGoals();
  }

  loadMyGoals() {
    this.goalService.getGoals().subscribe({
      next: (data) => {
        // Interceptamos los datos para inyectar el color corporativo antes de renderizar
        this.goals = data.map(goal => ({
          ...goal,
          color: this.getCategoryColor(goal.goalCategory)
        }));

        this.calculateTotals();
        this.buildChart();
      },
      error: (err) => console.error('Error al cargar metas', err)
    });
  }

  calculateTotals() {
    this.totalSaved = this.goals.reduce((sum, g) => sum + g.savedAmount, 0);
    this.totalTarget = this.goals.reduce((sum, g) => sum + g.targetAmount, 0);
    this.totalPercentage = this.totalTarget > 0
      ? Math.round((this.totalSaved / this.totalTarget) * 100)
      : 0;
  }

  buildChart() {
    this.pieChartData = {
      labels: this.goals.map(g => g.description || g.goalCategory),
      datasets: [{
        data: this.goals.map(g => g.savedAmount),
        backgroundColor: this.goals.map(g => g.color),
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 20
      }]
    };
  }

  // --- HELPERS ---
  getPercentage(saved: number, target: number): number {
    if (!target) return 0;
    return Math.min(Math.round((saved / target) * 100), 100);
  }

  getCategoryColor(category: string): string {
    if (!category) return '#006d36';
    const catUpper = category.toUpperCase();
    return this.categoryColors[catUpper] || '#006d36';
  }

  getGoalIcon(name: string): string {
    const n = name?.toLowerCase() || '';
    if (n.includes('ahorro')) return 'savings';
    if (n.includes('emergencia')) return 'shield';
    if (n.includes('vivienda')) return 'home';
    if (n.includes('transporte')) return 'directions_car';
    if (n.includes('viaje')) return 'flight';
    if (n.includes('educación')) return 'school';
    if (n.includes('compra')) return 'shopping_bag';
    if (n.includes('inversión')) return 'trending_up';
    return 'track_changes';
  }

  // --- LÓGICA DE EVENTOS (MODALES) ---
  openAddFundsModal(goalId: number) {
    this.selectedGoalId = goalId;
  }

  closeAddFundsModal() {
    this.selectedGoalId = null;
  }

  onFundsAdded() {
    this.closeAddFundsModal();
    this.loadMyGoals();
  }

  openDeleteConfirm(id: number) {
    this.goalToDeleteId = id;
  }

  cancelDelete() {
    this.goalToDeleteId = null;
  }

  confirmDelete() {
    if (this.goalToDeleteId === null) return;

    this.isDeletingGoal = true;

    this.goalService.deleteGoal(this.goalToDeleteId).subscribe({
      next: () => {
        this.isDeletingGoal = false;
        this.goalToDeleteId = null;
        this.loadMyGoals();
      },
      error: (err) => {
        alert('Error al eliminar la meta: ' + err.message);
        this.isDeletingGoal = false;
        this.goalToDeleteId = null;
      }
    });
  }
}
