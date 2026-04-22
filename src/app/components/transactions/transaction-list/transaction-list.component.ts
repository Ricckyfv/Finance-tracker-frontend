import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { Transaction } from '../../../core/models/transaction.models';
import { ConfirmDeleteModalComponent } from '../../../shared/components/confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, ConfirmDeleteModalComponent],
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent implements OnInit {
  private transactionService = inject(TransactionService);

  transactions: Transaction[] = [];
  transactionToDeleteId: number | null = null;
  isDeleting = false;

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getMyTransactions().subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error('Error cargando transacciones', err)
    });
  }
// --- MODAL PARA ELIMINAR UNA TRANSACCION ---
  // 1. Abre el modal y guarda qué ID queremos borrar
  openDeleteModal(id: number) {
    this.transactionToDeleteId = id;
  }

  // 2. Cierra el modal y limpia la variable
  closeDeleteModal() {
    this.transactionToDeleteId = null;
  }

  // 3. Ejecuta el borrado real contra el backend
  confirmDelete() {
    if (this.transactionToDeleteId === null) return;

    this.isDeleting = true;

    this.transactionService.deleteTransaction(this.transactionToDeleteId).subscribe({
      next: () => {
        // Quitamos la transacción de la tabla sin recargar la página
        this.transactions = this.transactions.filter(t => t.id !== this.transactionToDeleteId);

        // Restauramos el estado y cerramos
        this.isDeleting = false;
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error al borrar', err);
        this.isDeleting = false;
        this.closeDeleteModal();
      }
    });
  }

  //Metodo para mostrar el icono correcto según la categoría de la transacción
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

    // Icono por defecto si no coincide con nada
    return 'shopping_bag';
  }

}
