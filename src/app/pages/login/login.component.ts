import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
      next: () => this.router.navigate(['/cms']),
      error: () => {
        this.loading = false;
        this.errorMessage = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      }
    });
  }
}
