import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsContentService, ContentType } from '../../services/cms-content.service';

interface Category {
  value: string;
  label: string;
  type: ContentType;
}

@Component({
  selector: 'app-cms-editor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-editor-form.component.html',
  styleUrl: './cms-editor-form.component.css'
})
export class CmsEditorFormComponent {
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  title = '';
  description = '';
  selectedCategory = '';
  videoLink = '';
  publicationStatus: 'draft' | 'public' = 'draft';
  selectedFileName = '';
  imagePreview: string | null = null;
  lastSaved = '';
  author = 'Admin_Sustentabilidad';

  categories: Category[] = [
    { value: 'sostenibilidad', label: 'Sostenibilidad', type: 'BLOG' },
    { value: 'residuos', label: 'Gestión de Residuos', type: 'INSTRUCTIVO' },
    { value: 'energia', label: 'Energía Renovable', type: 'TUTORIAL' },
    { value: 'biodiversidad', label: 'Biodiversidad', type: 'BLOG' },
    { value: 'agua', label: 'Recursos Hídricos', type: 'INSTRUCTIVO' }
  ];

  constructor(private contentService: CmsContentService) {}

  onSaveDraft(): void {
    if (!this.title.trim()) return;

    const cat = this.categories.find(c => c.value === this.selectedCategory);
    const now = new Date();
    const formatted = now.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    this.contentService.add({
      title: this.title.trim(),
      author: this.author,
      type: cat?.type ?? 'TUTORIAL',
      publishDate: this.publicationStatus === 'public' ? formatted : null,
      status: this.publicationStatus === 'public' ? 'Publicado' : 'Borrador',
      imageUrl: this.imagePreview,
      description: this.description,
      category: this.selectedCategory,
      videoLink: this.videoLink
    });

    this.lastSaved = 'Ahora mismo';
    this.saved.emit();
  }

  onPreview(): void {}

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    (document.getElementById('coverImage') as HTMLInputElement)?.click();
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFileName = '';
    const input = document.getElementById('coverImage') as HTMLInputElement;
    if (input) input.value = '';
  }

  applyFormat(format: string): void {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = this.description.substring(start, end);

    const wrappers: Record<string, [string, string]> = {
      bold: ['**', '**'],
      italic: ['_', '_'],
      list: ['\n- ', ''],
      link: ['[', '](url)']
    };

    const wrap = wrappers[format];
    if (!wrap) return;

    this.description =
      this.description.substring(0, start) +
      wrap[0] + selected + wrap[1] +
      this.description.substring(end);
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.selectedCategory = '';
    this.videoLink = '';
    this.publicationStatus = 'draft';
    this.selectedFileName = '';
    this.imagePreview = null;
    this.lastSaved = '';
  }
}
