import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  rememberSession = false;
  showPassword = false;
  errorMessage = '';
  loading = false;

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/cms']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. El backend puede estar iniciando (espera 30 segundos e intenta de nuevo).';
        } else if (err.status === 401 || err.status === 422) {
          this.errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
        } else if (err.status === 404) {
          this.errorMessage = 'Endpoint de login no encontrado. Verifica la configuración del servidor.';
        } else {
          this.errorMessage = `Error ${err.status}: ${err.error?.message ?? err.message}`;
        }
      }
    });
  }
}
