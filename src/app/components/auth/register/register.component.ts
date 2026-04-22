import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

// Validador personalizado para comprobar que las contraseñas coinciden
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage: string | null = null;
  showSuccessMessage = false;
  showPassword = false;
  showConfirmPassword = false;

  // Formulario reactivo
  registerForm: FormGroup = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]] // Obliga a que el checkbox esté marcado
  }, { validators: passwordsMatchValidator }); // Aplicamos el validador a todo el grupo

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      // Marcamos todos los campos como tocados para que salten los errores visuales
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Extraemos los datos. El backend espera 'name' en lugar de 'fullname', así que lo mapeamos aquí.
    const { fullname, email, password } = this.registerForm.value;
    const registerRequest = { name: fullname, email, password };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;

        // Leemos el mensaje del backend (puede venir como texto o como objeto JSON)
        const backendMessage = typeof err.error === 'string' ? err.error : err.error?.message;

        // Si el servidor nos devuelve un error 403 o 400, asumimos que es por el email duplicado
        if (err.status === 403 || err.status === 400 || err.status === 409) {
          this.errorMessage = backendMessage || 'Este correo electrónico ya está registrado. Por favor, inicia sesión.';
        } else {
          // Error genérico si el servidor se cae o no hay internet
          this.errorMessage = 'Hubo un error al crear la cuenta. Inténtalo de nuevo más tarde.';
        }
      }
    });
  }
}
