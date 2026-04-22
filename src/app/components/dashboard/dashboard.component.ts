import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para Pipes y Directivas
import { TransactionService } from '../../core/services/transaction/transaction.service';
import { Transaction, TransactionSummary } from '../../core/models/transaction.models';
import { TransactionFormComponent } from '../transactions/transaction-form/transaction-form.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private transactionService = inject(TransactionService);

  // Nuestras variables para guardar los datos reales
  summary: TransactionSummary | null = null;
  recentTransactions: Transaction[] = [];
  showModal = false;
  modalType: 'INCOME' | 'EXPENSE' = 'EXPENSE';

  openModal(type: 'INCOME' | 'EXPENSE') {
  this.modalType = type;
  this.showModal = true;
  }

  ngOnInit(): void {
    this.loadSummary();
    this.loadTransactions();
  }

  loadSummary() {
    this.transactionService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;

        // dataset[0] son los Ingresos, dataset[1] son los Gastos
        this.barChartData.datasets[0].data = [data.totalIncome];
        this.barChartData.datasets[1].data = [data.totalExpenses];
      },
      error: (err) => console.error('Error cargando el resumen', err)
    });
  }

  loadTransactions() {
    this.transactionService.getMyTransactions().subscribe({
      next: (data) => {
        // Solo mostramos las últimas 4 transacciones
        this.recentTransactions = data.slice(0, 4);
        this.buildBarChartData(data); // Construimos el gráfico con TODAS las transacciones para que se actualice al cargar
      },
      error: (err) => console.error('Error cargando transacciones', err)
    });
  }

  // --- GRÁFICA DE BARRAS (INGRESOS VS GASTOS) ---
  public barChartType: 'bar' = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: ['Balance'],
    datasets: [
      {
        label: 'Ingresos',
        data: [0],
        backgroundColor: '#16a34a',
        borderRadius: 8,
        barThickness: 60
      },
      {
        label: 'Gastos',
        data: [0],
        backgroundColor: '#dc2626',
        borderRadius: 8,
        barThickness: 60
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      delay: (context) => {
        let delay = 0;
        // Solo animamos la carga inicial ('default')
        if (context.type === 'data' && context.mode === 'default') {
          // Cada dataset (Ingreso, luego Gasto) se retrasa 300 milisegundos más que el anterior
          delay = context.datasetIndex * 300;
        }
        return delay;
      },
    },
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true } // Para que las barras siempre empiecen desde abajo
    }
  };

  // --- LÓGICA PARA HISTORIAL DE MESES ---
  buildBarChartData(transactions: any[]) {
    // 1. Objeto para guardar los totales por mes
    const monthlyData: { [key: string]: { income: number, expense: number, monthNum: number, yearNum: number } } = {};

    transactions.forEach(t => {
      if (!t.transactionDate) return;

      let txMonth = 0;
      let txYear = 0;

      // Escudo anti-zonas horarias
      if (Array.isArray(t.transactionDate)) {
        txYear = t.transactionDate[0];
        txMonth = t.transactionDate[1];
      } else {
        const dateStr = t.transactionDate.toString();
        txYear = parseInt(dateStr.substring(0, 4));
        txMonth = parseInt(dateStr.substring(5, 7));
      }

      // Creamos una llave única para agrupar (Ej: "2026-03")
      const monthKey = `${txYear}-${txMonth.toString().padStart(2, '0')}`;

      // Si es la primera vez que vemos este mes, lo creamos en cero
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, monthNum: txMonth, yearNum: txYear };
      }

      // Sumamos en positivo
      const amount = Math.abs(t.amount);
      const isIncome = t.categoryType === 'INCOME' || t.category?.type === 'INCOME';

      if (isIncome) {
        monthlyData[monthKey].income += amount;
      } else {
        monthlyData[monthKey].expense += amount;
      }
    });

    // 2. Ordenamos los meses cronológicamente (De más antiguo a más reciente)
    const sortedKeys = Object.keys(monthlyData).sort();

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // 3. Extraemos las listas ordenadas para Chart.js
    const labels = sortedKeys.map(key => `${monthNames[monthlyData[key].monthNum - 1]} ${monthlyData[key].yearNum}`);
    const incomeData = sortedKeys.map(key => monthlyData[key].income);
    const expenseData = sortedKeys.map(key => monthlyData[key].expense);

    // 4. Actualizamos el gráfico
    this.barChartData = {
      labels: labels, // Aquí irán ["Feb 2026", "Mar 2026", ...]
      datasets: [
        {
          label: 'Ingresos',
          data: incomeData,
          backgroundColor: '#16a34a',
          borderRadius: 6,
          maxBarThickness: 40
        },
        {
          label: 'Gastos',
          data: expenseData,
          backgroundColor: '#dc2626',
          borderRadius: 6,
          maxBarThickness: 40
        }
      ]
    };
  }
}
