import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-delete-modal.component.html'
})
export class ConfirmDeleteModalComponent {
  // Entradas (Lo que le pasamos desde el componente padre)
  @Input() title: string = 'Confirmar Eliminación';
  @Input() message: string = '¿Estás seguro de que deseas eliminar este elemento?';
  @Input() isLoading: boolean = false; // Por si queremos mostrar un spinner al borrar

  // Salidas (Eventos que avisarán al componente padre)
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    if (!this.isLoading) { // Evitar que cierre si ya se está borrando
      this.cancel.emit();
    }
  }
}
