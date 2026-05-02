import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-section-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './section-contact.component.html',
  styleUrl: './section-contact.component.css'
})
export class SectionContactComponent {
  contactForm: FormGroup;
  submitted = false;
  successMessage = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{7,}$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      this.successMessage = true;
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        this.contactForm.reset();
        this.submitted = false;
        this.successMessage = false;
      }, 3000);
    }
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
