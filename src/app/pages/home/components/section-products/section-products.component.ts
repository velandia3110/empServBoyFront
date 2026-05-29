import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductWithImages } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-section-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-products.component.html',
  styleUrl: './section-products.component.css'
})
export class SectionProductsComponent implements OnInit {
  private productsService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);

  products: ProductWithImages[] = [];
  loading = true;
  error = false;

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges()
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFirstImage(product: ProductWithImages): string {
    const img = product.images?.[0];
    if (!img) return '/assets/residuos.jpg';
    return img.imageurl.startsWith('http')
      ? img.imageurl
      : `${environment.apiUrl.replace('/api', '')}${img.imageurl}`;
  }

  getFirstAlt(product: ProductWithImages): string {
    return product.images?.[0]?.alt ?? product.name;
  }
}
