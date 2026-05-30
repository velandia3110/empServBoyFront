import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { timeout, TimeoutError } from 'rxjs';
import { ArticlesService } from '../../../../core/services/articles.service';
import { ArticleWithRelations, MultimediaBlock, MultimediaType } from '../../../../core/models/article.model';

const CLOUDINARY_CLOUD = 'dadlwrnx3';
const CLOUDINARY_PRESET = 'empservboy_uploads';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

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
  slowSave = false;
  lastSaved = '';
  errorMsg = '';

  previews:            Record<number, string>  = {};
  cloudinaryUploading: Record<number, boolean> = {};
  cloudinaryError:     Record<number, string>  = {};

  private zone = inject(NgZone);
  private cdr  = inject(ChangeDetectorRef);

  get isEditing(): boolean { return !!this.article; }

  constructor(private articlesService: ArticlesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article']) this.loadArticle();
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
    const prev = this.previews[index];
    if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
    delete this.previews[index];
    delete this.cloudinaryUploading[index];
    delete this.cloudinaryError[index];
    this.blocks.splice(index, 1);
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const prev = this.previews[index];
    if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
    this.previews[index] = URL.createObjectURL(file);
    this.cloudinaryUploading[index] = true;
    this.cloudinaryError[index] = '';
    this.blocks[index].file = undefined;
    this.blocks[index].resourceUrl = '';

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_PRESET);

    console.log('[Cloudinary] Enviando imagen a:', CLOUDINARY_URL);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_URL);
    xhr.timeout = 60000;

    xhr.onload = () => {
      console.log('[Cloudinary] Respuesta recibida, status:', xhr.status);
      this.cloudinaryUploading[index] = false;
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            this.blocks[index].resourceUrl = data.secure_url;
            this.blocks[index].file = file;
            this.previews[index] = data.secure_url;
          } else {
            this.cloudinaryError[index] = 'No se pudo subir la imagen. Intenta de nuevo.';
            delete this.previews[index];
          }
        } catch {
          this.cloudinaryError[index] = 'Error al procesar respuesta de Cloudinary.';
          delete this.previews[index];
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          this.cloudinaryError[index] = err?.error?.message ?? `Error ${xhr.status} al subir la imagen.`;
        } catch {
          this.cloudinaryError[index] = `Error ${xhr.status} al subir la imagen.`;
        }
        console.error('[Cloudinary error]', xhr.status, xhr.responseText);
        delete this.previews[index];
      }
      this.zone.run(() => this.cdr.detectChanges());
    };

    xhr.onerror = () => {
      console.error('[Cloudinary] onerror — request bloqueado o sin red');
      this.cloudinaryUploading[index] = false;
      this.cloudinaryError[index] = 'Error de red al conectar con Cloudinary.';
      delete this.previews[index];
      this.zone.run(() => this.cdr.detectChanges());
    };

    xhr.ontimeout = () => {
      console.error('[Cloudinary] ontimeout — 60s sin respuesta');
      this.cloudinaryUploading[index] = false;
      this.cloudinaryError[index] = 'Tiempo de espera agotado. Intenta de nuevo.';
      delete this.previews[index];
      this.zone.run(() => this.cdr.detectChanges());
    };

    console.log('[Cloudinary] xhr.send() →', { preset: CLOUDINARY_PRESET, fileSize: file.size });
    xhr.send(fd);
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

  get hasUploadInProgress(): boolean {
    return Object.values(this.cloudinaryUploading).some(v => v);
  }

  onSave(): void {
    if (!this.title.trim()) { this.errorMsg = 'El título es requerido.'; return; }
    if (this.hasUploadInProgress) { this.errorMsg = 'Espera a que termine la subida de imágenes.'; return; }

    this.loading = true;
    this.errorMsg = '';
    this.slowSave = false;

    const slowTimer = setTimeout(() => { this.slowSave = true; }, 5000);

    const request = this.isEditing
      ? this.articlesService.update(this.article!.articleId, this.title, this.blocks)
      : this.articlesService.create(this.title, this.blocks);

    request.pipe(timeout(90000)).subscribe({
      next: () => {
        clearTimeout(slowTimer);
        this.loading = false;
        this.slowSave = false;
        this.lastSaved = 'Ahora mismo';
        this.saved.emit();
      },
      error: (err) => {
        clearTimeout(slowTimer);
        this.loading = false;
        this.slowSave = false;
        if (err instanceof TimeoutError) {
          this.errorMsg = 'El servidor tardó demasiado. Intenta de nuevo en unos segundos.';
        } else {
          const body = err?.error;
          const detail = body?.message ?? body?.error ?? JSON.stringify(body);
          const fields = body?.errors ? '\n' + JSON.stringify(body.errors, null, 2) : '';
          this.errorMsg = `Error ${err?.status}: ${detail}${fields}`;
        }
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
    this.previews = {};
    this.cloudinaryUploading = {};
    this.cloudinaryError = {};
  }
}
