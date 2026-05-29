import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuotesService } from '../../../../core/services/quotes.service';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductWithImages } from '../../../../core/models/product.model';

@Component({
  selector: 'app-section-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './section-contact.component.html',
  styleUrl: './section-contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private quotesService = inject(QuotesService);
  private productsService = inject(ProductsService);

  contactForm: FormGroup;
  submitted = false;
  successMessage = false;
  loading = false;
  errorMessage = '';

  availableProducts: ProductWithImages[] = [];
  selectedProductIds: Set<string> = new Set();

  constructor() {
    this.contactForm = this.fb.group({
      name:    ['', [Validators.required, Validators.maxLength(50)]],
      email:   ['', [Validators.required, Validators.email, Validators.maxLength(80)]],
      phone:   ['', [Validators.required, Validators.maxLength(50)]],
      message: ['', [Validators.maxLength(2000)]]
    });
  }

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
      next: data => this.availableProducts = data
    });
  }

  toggleProduct(id: string): void {
    if (this.selectedProductIds.has(id)) {
      this.selectedProductIds.delete(id);
    } else {
      this.selectedProductIds.add(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedProductIds.has(id);
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.contactForm.invalid) return;
    if (this.selectedProductIds.size === 0) {
      this.errorMessage = 'Por favor selecciona al menos un producto de interés.';
      return;
    }

    this.loading = true;
    const { name, email, phone, message } = this.contactForm.value;
    const items = [...this.selectedProductIds].map(productId => ({ productId, quantity: 1 }));

    this.quotesService.send({
      client_name: name,
      client_email: email,
      client_phone: phone,
      description: message || undefined,
      items
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = true;
        setTimeout(() => {
          this.contactForm.reset();
          this.submitted = false;
          this.successMessage = false;
          this.selectedProductIds.clear();
        }, 3000);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Ocurrió un error al enviar la solicitud. Intenta de nuevo.';
      }
    });
  }

  get name()    { return this.contactForm.get('name'); }
  get email()   { return this.contactForm.get('email'); }
  get phone()   { return this.contactForm.get('phone'); }
  get message() { return this.contactForm.get('message'); }
}
