import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Budget } from '../../models/budget.models';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/budgets';


    createBudget(budget: Budget): Observable<Budget> {
        return this.http.post<Budget>(this.apiUrl, budget);
    }

    getBudgets(): Observable<Budget[]> {
        return this.http.get<Budget[]>(this.apiUrl);
    }

    deleteBudget(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
