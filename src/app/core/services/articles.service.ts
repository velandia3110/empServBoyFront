import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArticleWithRelations, MultimediaBlock } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/articles`;

  getAll(): Observable<ArticleWithRelations[]> {
    return this.http.get<ArticleWithRelations[]>(this.base);
  }

  getById(id: string): Observable<ArticleWithRelations> {
    return this.http.get<ArticleWithRelations>(`${this.base}/${id}`);
  }

  create(title: string, multimedia: MultimediaBlock[]): Observable<ArticleWithRelations> {
    const fd = this.buildFormData(title, multimedia);
    return this.http.post<ArticleWithRelations>(this.base, fd);
  }

  update(id: string, title: string, multimedia: MultimediaBlock[]): Observable<ArticleWithRelations> {
    const fd = this.buildFormData(title, multimedia);
    return this.http.post<ArticleWithRelations>(`${this.base}/${id}?_method=PUT`, fd);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  private buildFormData(title: string, multimedia: MultimediaBlock[]): FormData {
    console.table(multimedia.map((b, i) => ({
      i, type: b.type, resourceUrl: b.resourceUrl || '(vacío)', hasFile: !!b.file
    })));
    const fd = new FormData();
    fd.append('title', title);
    multimedia.forEach((block, i) => {
      if (block.multimediaId)        fd.append(`multimedia[${i}][multimediaId]`, block.multimediaId);
      fd.append(`multimedia[${i}][type]`, block.type);
      if (block.type !== 'IMAGE' && block.content?.trim())
                                     fd.append(`multimedia[${i}][content]`,     block.content.trim());
      if (block.resourceUrl?.trim()) fd.append(`multimedia[${i}][resourceUrl]`, block.resourceUrl.trim());
      if (block.file && !block.resourceUrl?.trim()) fd.append(`multimedia[${i}][file]`, block.file);
    });
    return fd;
  }
}
