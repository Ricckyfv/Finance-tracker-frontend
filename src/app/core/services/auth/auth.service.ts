import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest, AuthResponse } from '../../models/auth.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor() { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => this.saveToken(response.token))
      );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => this.saveToken(response.token))
      );
  }

  //Métodos auxiliares para gestionar el Token en el navegador (Local Storage)
  private saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  public logout(): void {
    localStorage.removeItem('jwt_token');
  }

  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  public getUserEmail(): string {
    const token = this.getToken();
    if (!token) return 'Usuario';

    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      const data = JSON.parse(decoded);

      return data.sub || 'Usuario';
    } catch (error) {
      console.error('Error decodificando el token', error);
      return 'Usuario';
    }
  }
}
