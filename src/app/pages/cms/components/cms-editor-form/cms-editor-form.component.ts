import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticlesService } from '../../../../core/services/articles.service';
import { ArticleWithRelations, MultimediaBlock, MultimediaType } from '../../../../core/models/article.model';

@Component({
  selector: 'app-cms-editor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-editor-form.component.html',
  styleUrl: './cms-editor-form.component.css'
})
export class CmsEditorFormComponent implements OnChanges {
  @Input() article: ArticleWithRelations | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  title = '';
  blocks: MultimediaBlock[] = [];
  loading = false;
  lastSaved = '';
  errorMsg = '';

  get isEditing(): boolean { return !!this.article; }

  constructor(private articlesService: ArticlesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article']) {
      this.loadArticle();
    }
  }

  private loadArticle(): void {
    if (this.article) {
      this.title = this.article.title;
      this.blocks = this.article.multimedia.map(m => ({
        multimediaId: m.multimediaId,
        type: m.type,
        content: m.content ?? '',
        resourceUrl: m.resourceUrl ?? ''
      }));
    } else {
      this.resetForm();
    }
  }

  addBlock(type: MultimediaType): void {
    this.blocks.push({ type, content: '', resourceUrl: '' });
  }

  removeBlock(index: number): void {
    this.blocks.splice(index, 1);
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    this.blocks[index].file = input.files[0];
    this.blocks[index].resourceUrl = '';
  }

  applyFormat(format: string, index: number): void {
    const block = this.blocks[index];
    if (block.type !== 'TEXT') return;
    const wrappers: Record<string, [string, string]> = {
      bold: ['**', '**'],
      italic: ['_', '_'],
      list: ['\n- ', ''],
      link: ['[', '](url)']
    };
    const wrap = wrappers[format];
    if (!wrap) return;
    block.content = (block.content ?? '') + wrap[0] + wrap[1];
  }

  onSave(): void {
    if (!this.title.trim()) {
      this.errorMsg = 'El título es requerido.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    const request = this.isEditing
      ? this.articlesService.update(this.article!.articleId, this.title, this.blocks)
      : this.articlesService.create(this.title, this.blocks);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.lastSaved = 'Ahora mismo';
        this.saved.emit();
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Ocurrió un error al guardar. Intenta de nuevo.';
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.title = '';
    this.blocks = [];
    this.lastSaved = '';
    this.errorMsg = '';
  }
}
