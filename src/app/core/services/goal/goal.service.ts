import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private http = inject(HttpClient);
  // Ajusta esta URL si tu puerto es diferente
  private apiUrl = 'http://localhost:8080/api/goals';

  // Función de ayuda para obtener el token del LocalStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // O donde sea que guardes tu JWT
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getGoals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createGoal(goal: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, goal, { headers: this.getHeaders() });
  }

  deleteGoal(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  addFunds(id: number, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/add-funds`, { amount }, { headers: this.getHeaders() });
  }
}
