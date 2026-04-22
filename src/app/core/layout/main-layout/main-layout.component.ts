import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userEmail: string = '';
  isMobileMenuOpen = false;

  // Método para alternar el menú móvil
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Cierra el menú (útil para cuando hacen clic en un enlace o fuera del menú)
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  ngOnInit() {
    this.userEmail = this.authService.getUserEmail();
  }

  onLogout() {
    this.authService.logout(); // Borra el token
    this.router.navigate(['/login']);
  }
}
