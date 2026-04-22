import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { BudgetListComponent } from './components/budgets/budget-list/budget-list.component';
import { GoalsComponent } from './components/goals/goal-list/goals.component';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // RUTA PADRE PROTEGIDA (El Esqueleto)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard], // El guardián protege el layout y todo lo de dentro
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionListComponent },
      { path: 'budgets', component: BudgetListComponent },
      { path: 'goals', component: GoalsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Si ponen localhost:4200/ van al dashboard
    ]
  },
  { path: 'register', component: RegisterComponent },
  // Cualquier ruta rara la mandamos al login
  { path: '**', redirectTo: 'login' }
];
