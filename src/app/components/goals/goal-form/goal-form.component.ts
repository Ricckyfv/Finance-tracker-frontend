import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../../core/services/goal/goal.service'; // Ajusta tu ruta

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-form.component.html'
})
export class GoalFormComponent {
  private goalService = inject(GoalService);

  // Eventos para comunicarnos con el padre (GoalsComponent)
  @Output() close = new EventEmitter<void>();
  @Output() goalCreated = new EventEmitter<void>();

  isSaving = false;
  presetColors = ['#006d36', '#435b9f', '#ba1a1a', '#f59e0b', '#8b5cf6', '#0ea5e9'];

  // Definimos las categorías de metas con su valor, etiqueta e ícono correspondiente
  goalCategories = [
    { value: 'AHORRO', label: 'Ahorro', icon: 'savings' },
    { value: 'FONDO_EMERGENCIA', label: 'Fondo de emergencia', icon: 'shield' },
    { value: 'VIVIENDA', label: 'Vivienda', icon: 'home' },
    { value: 'TRANSPORTE', label: 'Transporte', icon: 'directions_car' },
    { value: 'VIAJE', label: 'Viaje', icon: 'flight_takeoff' },
    { value: 'EDUCACION', label: 'Educación', icon: 'school' },
    { value: 'COMPRA_IMPORTANTE', label: 'Compra importante', icon: 'shopping_bag' },
    { value: 'INVERSION', label: 'Inversión', icon: 'trending_up' },
    { value: 'OTROS', label: 'Otros', icon: 'add_circle' }
  ];

  // Modelo para la nueva meta que vamos a crear
  newGoal = {
    goalCategory: '',
    description: '',
    targetAmount: null as number | null,
    deadline: '',
    color: this.presetColors[0]
  };

  // ==========================================
  // LÓGICA DEL SELECT CUSTOMIZADO
  // ==========================================
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategory(catValue: string) {
    this.newGoal.goalCategory = catValue;
    this.isDropdownOpen = false;
  }

  // Getter para encontrar el objeto completo de la categoría seleccionada y mostrar su icono
  get selectedCategoryObj() {
    return this.goalCategories.find(c => c.value === this.newGoal.goalCategory) || null;
  }
  // ==========================================

  selectColor(color: string) {
    this.newGoal.color = color;
  }

  closeModal() {
    this.close.emit(); // Avisamos al padre que cierre el modal
  }

  saveGoal() {
    if (!this.newGoal.goalCategory || !this.newGoal.targetAmount) return;

    this.isSaving = true;

    // Saneamos los datos (como vimos antes para evitar el error de la fecha)
    const payloadToSend = {
      goalCategory: this.newGoal.goalCategory,
      description: this.newGoal.description,
      targetAmount: this.newGoal.targetAmount,
      color: this.newGoal.color,
      deadline: this.newGoal.deadline ? this.newGoal.deadline : null
    };

    this.goalService.createGoal(payloadToSend).subscribe({
      next: () => {
        this.isSaving = false;
        this.goalCreated.emit(); // Avisamos al padre que recargue la lista
        this.closeModal();
      },
      error: (err) => {
        console.error('Error guardando la meta', err);
        alert('Fallo del Servidor: ' + (err.error?.message || err.statusText));
        this.isSaving = false;
      }
    });
  }
}
