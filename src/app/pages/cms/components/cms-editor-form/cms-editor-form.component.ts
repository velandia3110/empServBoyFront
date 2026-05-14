import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Category {
  value: string;
  label: string;
}

@Component({
  selector: 'app-cms-editor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cms-editor-form.component.html',
  styleUrl: './cms-editor-form.component.css'
})
export class CmsEditorFormComponent {
  title = '';
  description = '';
  selectedCategory = '';
  videoLink = '';
  publicationStatus = 'draft';
  selectedFileName = '';
  lastSaved = 'Hace 2 minutos';
  author = 'Admin_Sustentabilidad';

  categories: Category[] = [
    { value: 'sostenibilidad', label: 'Sostenibilidad' },
    { value: 'residuos', label: 'Gestión de Residuos' },
    { value: 'energia', label: 'Energía Renovable' },
    { value: 'biodiversidad', label: 'Biodiversidad' },
    { value: 'agua', label: 'Recursos Hídricos' }
  ];

  onSaveDraft(): void {
    this.lastSaved = 'Ahora mismo';
    console.log('Borrador guardado', {
      title: this.title,
      description: this.description,
      category: this.selectedCategory,
      status: this.publicationStatus
    });
  }

  onPreview(): void {
    console.log('Previsualizar contenido');
  }

  onCancel(): void {
    this.title = '';
    this.description = '';
    this.selectedCategory = '';
    this.videoLink = '';
    this.publicationStatus = 'draft';
    this.selectedFileName = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFileName = input.files[0].name;
    }
  }

  triggerFileInput(): void {
    const input = document.getElementById('coverImage') as HTMLInputElement;
    input?.click();
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
}
