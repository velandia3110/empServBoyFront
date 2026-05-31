import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductsService } from '../../../../core/services/products.service';
import { ProductWithImages } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-cms-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './cms-product-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmsProductFormComponent implements OnChanges {

  @Input() product: ProductWithImages | null = null;

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  saving = false;
  errorMsg = '';

  form = {
    name: '',
    description: '',
    alt: ''
  };

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      if (this.product) {
        this.form = {
          name: this.product.name,
          description: this.product.description,
          alt: this.product.images?.[0]?.alt ?? ''
        };
        const rawUrl = this.product.images?.[0]?.imageurl ?? null;
        this.imagePreview = rawUrl
          ? (rawUrl.startsWith('http')
            ? rawUrl
            : `${environment.apiUrl.replace('/api', '')}${rawUrl}`)
          : null;

      } else {
        this.resetForm();
      }
      this.cdr.markForCheck();
    }
  }

  get isEditMode(): boolean {
    return !!this.product;
  }

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.selectedImage = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.cdr.markForCheck();
    };

    reader.readAsDataURL(this.selectedImage);
  }

  removeImage(): void {

    this.selectedImage = null;
    this.imagePreview = null;

    this.cdr.markForCheck();
  }

  save(): void {

    this.errorMsg = '';

    if (!this.form.name.trim()) {
      this.errorMsg = 'Debes ingresar el nombre del producto.';
      this.cdr.markForCheck();
      return;
    }

    if (!this.form.description.trim()) {
      this.errorMsg = 'Debes ingresar una descripción.';
      this.cdr.markForCheck();
      return;
    }

    const formData = new FormData();

    formData.append('name', this.form.name.trim());
    formData.append('description', this.form.description.trim());

    if (this.selectedImage) {

      formData.append(
        'images[0][file]',
        this.selectedImage
      );

      formData.append(
        'images[0][alt]',
        this.form.alt.trim() || this.form.name.trim()
      );
    }

    this.saving = true;
    this.cdr.markForCheck();

    if (this.isEditMode) {

      this.productService
        .update(this.product!.productId, formData)
        .subscribe({
          next: () => {
            this.saving = false;
            this.saved.emit();
          },
          error: () => {
            this.saving = false;
            this.errorMsg =
              'No se pudo actualizar el producto.';
            this.cdr.markForCheck();
          }
        });

      return;
    }

    this.productService
      .create(formData)
      .subscribe({
        next: () => {
          this.saving = false;
          this.saved.emit();
        },
        error: () => {
          this.saving = false;
          this.errorMsg =
            'No se pudo crear el producto.';
          this.cdr.markForCheck();
        }
      });
  }

  resetForm(): void {

    this.form = {
      name: '',
      description: '',
      alt: ''
    };

    this.selectedImage = null;
    this.imagePreview = null;
  }

  cancel(): void {
    this.cancelled.emit();
  }
}