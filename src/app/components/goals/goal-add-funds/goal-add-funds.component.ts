import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../../core/services/goal/goal.service';

@Component({
  selector: 'app-goal-add-funds',
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-add-funds.component.html',
  styleUrl: './goal-add-funds.component.css'
})
export class GoalAddFundsComponent {
  private goalService = inject(GoalService);

  // ==========================================
  // INPUTS Y OUTPUTS
  // ==========================================
  @Input() goalId: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() fundsAdded = new EventEmitter<void>();

  // ==========================================
  // VARIABLES PARA AÑADIR FONDOS
  // ==========================================
  fundsAmount: number | null = null;
  isAddingFunds = false;

  // ==========================================
  // MÉTODOS
  // ==========================================
  closeModal() {
    this.close.emit();
    this.resetForm();
  }

  confirmAddFunds() {
    if (!this.goalId || !this.fundsAmount || this.fundsAmount <= 0) return;

    this.isAddingFunds = true;
    this.goalService.addFunds(this.goalId, this.fundsAmount).subscribe({
      next: () => {
        this.isAddingFunds = false;
        this.resetForm();
        this.fundsAdded.emit();
      },
      error: (err) => {
        console.error('Error al abonar', err);
        alert('Error al abonar fondos: ' + err.message);
        this.isAddingFunds = false;
      }
    });
  }

  private resetForm() {
    this.fundsAmount = null;
  }
}
