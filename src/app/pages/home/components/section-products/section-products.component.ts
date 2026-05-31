import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductWithImages } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment';
import { SettingsService } from '../../../../core/services/settings.service';

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
  private settingsService = inject(SettingsService);

  products: ProductWithImages[] = [];
  loading = true;
  error = false;
  toneladas$ = this.settingsService.toneladas$;

  // ── Modal ──
  selectedProduct: ProductWithImages | null = null;
  drawerOpen = false;

  ngOnInit(): void {
    this.productsService.getAll().subscribe({
      next: data => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openDrawer(product: ProductWithImages): void {
    this.selectedProduct = product;
    // Pequeño delay para que Angular renderice el elemento antes de activar la animación
    setTimeout(() => {
      this.drawerOpen = true;
      this.cdr.detectChanges();
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    document.body.style.overflow = '';
    setTimeout(() => {
      this.selectedProduct = null;
      this.cdr.detectChanges();
    }, 300);
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

  getAllImages(product: ProductWithImages): { url: string; alt: string }[] {
    return (product.images ?? []).map(img => ({
      url: img.imageurl.startsWith('http')
        ? img.imageurl
        : `${environment.apiUrl.replace('/api', '')}${img.imageurl}`,
      alt: img.alt ?? product.name
    }));
  }
}