import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsContentService, ContentItem, ContentType } from '../../services/cms-content.service';

@Component({
  selector: 'app-cms-content-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-content-list.component.html',
  styleUrl: './cms-content-list.component.css'
})
export class CmsContentListComponent implements OnInit {
  @Output() newContent = new EventEmitter<void>();

  allItems: ContentItem[] = [];
  filteredItems: ContentItem[] = [];
  pagedItems: ContentItem[] = [];

  filterType = 'todos';
  filterDate = 'cualquiera';

  currentPage = 1;
  pageSize = 4;
  totalPages = 1;

  typeOptions = [
    { value: 'todos', label: 'Todos los tipos' },
    { value: 'TUTORIAL', label: 'Tutorial' },
    { value: 'BLOG', label: 'Blog' },
    { value: 'INSTRUCTIVO', label: 'Instructivo' }
  ];

  constructor(private contentService: CmsContentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.allItems = this.contentService.getAll();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredItems = this.allItems.filter(item => {
      const matchType = this.filterType === 'todos' || item.type === this.filterType;
      return matchType;
    });
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

  deleteItem(id: number): void {
    this.contentService.delete(id);
    this.load();
  }

  typeBadgeClass(type: ContentType): string {
    const map: Record<ContentType, string> = {
      TUTORIAL: 'bg-blue-600 text-white',
      BLOG: 'bg-lime-400 text-gray-800',
      INSTRUCTIVO: 'bg-slate-500 text-white'
    };
    return map[type] ?? 'bg-gray-200 text-gray-700';
  }

  statusClass(status: string): string {
    return status === 'Publicado' ? 'text-green-600' : 'text-orange-500';
  }

  dotClass(status: string): string {
    return status === 'Publicado' ? 'bg-green-500' : 'bg-orange-400';
  }
}
