import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductWithImages } from '../../../../core/models/product.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-cms-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cms-product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmsProductListComponent implements OnInit {

  @Output() newProduct = new EventEmitter<void>();
  @Output() editProduct = new EventEmitter<ProductWithImages>();

  private productService = inject(ProductsService);
  private cdr = inject(ChangeDetectorRef);

  allItems: ProductWithImages[] = [];
  filteredItems: ProductWithImages[] = [];
  pagedItems: ProductWithImages[] = [];

  loading = true;
  errorMsg = '';

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productService.getAll().subscribe({
      next: products => {
        this.allItems = products;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'No se pudieron cargar los productos.';
        this.cdr.markForCheck();
      }
    });
  }

  applyFilters(): void {
    this.filteredItems = [...this.allItems];
    this.currentPage = 1;
    this.updatePage();
  }

  updatePage(): void {
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredItems.length / this.pageSize)
    );

    const start = (this.currentPage - 1) * this.pageSize;

    this.pagedItems = this.filteredItems.slice(
      start,
      start + this.pageSize
    );
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePage();
    this.cdr.markForCheck();
  }

  get pageNumbers(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }

  get showingFrom(): number {
    return this.filteredItems.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredItems.length
    );
  }

  deleteItem(id: string): void {
    if (!confirm('¿Eliminar este producto?')) return;

    this.productService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el producto.')
    });
  }

  editItem(product: ProductWithImages): void {
    this.editProduct.emit(product);
  }

  firstImage(product: ProductWithImages): string | null {
    const img = product.images?.[0];
    if (!img) return null;
    return img.imageurl.startsWith('http')
      ? img.imageurl
      : `${environment.apiUrl.replace('/api', '')}${img.imageurl}`;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}