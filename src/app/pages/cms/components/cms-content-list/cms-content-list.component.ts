import {
  Component, OnInit, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticlesService } from '../../../../core/services/articles.service';
import { ArticleWithRelations } from '../../../../core/models/article.model';

@Component({
  selector: 'app-cms-content-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-content-list.component.html',
  styleUrl: './cms-content-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmsContentListComponent implements OnInit {
  @Output() newContent = new EventEmitter<void>();
  @Output() editContent = new EventEmitter<ArticleWithRelations>();

  private articlesService = inject(ArticlesService);
  private cdr = inject(ChangeDetectorRef);

  allItems: ArticleWithRelations[] = [];
  filteredItems: ArticleWithRelations[] = [];
  pagedItems: ArticleWithRelations[] = [];

  loading = true;
  errorMsg = '';

  currentPage = 1;
  pageSize = 4;
  totalPages = 1;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.markForCheck();

    this.articlesService.getAll().subscribe({
      next: data => {
        this.allItems = data;
        this.applyFilters();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.status === 0
          ? 'No se pudo conectar con el servidor. El backend puede estar iniciando, intenta de nuevo.'
          : 'No se pudieron cargar los artículos. Intenta de nuevo.';
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
    this.totalPages = Math.max(1, Math.ceil(this.filteredItems.length / this.pageSize));
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedItems = this.filteredItems.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
    this.cdr.markForCheck();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get showingFrom(): number {
    return this.filteredItems.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredItems.length);
  }

  deleteItem(id: string): void {
    if (!confirm('¿Eliminar este artículo?')) return;
    this.articlesService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('No se pudo eliminar el artículo.')
    });
  }

  editItem(article: ArticleWithRelations): void {
    this.editContent.emit(article);
  }

  authorName(article: ArticleWithRelations): string {
    return article.user ? `${article.user.firstName} ${article.user.lastName}` : 'Desconocido';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  firstImage(article: ArticleWithRelations): string | null {
    const img = article.multimedia?.find(m => m.type === 'IMAGE');
    return img?.resourceUrl ?? null;
  }

  firstText(article: ArticleWithRelations): string {
    const txt = article.multimedia?.find(m => m.type === 'TEXT');
    return txt?.content?.substring(0, 80) ?? '';
  }
}
