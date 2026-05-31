import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductWithImages, ProductImage } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/products`;

  getAll(): Observable<ProductWithImages[]> {
    return this.http.get<ProductWithImages[]>(this.base);
  }

  getById(id: string): Observable<ProductWithImages> {
    return this.http.get<ProductWithImages>(`${this.base}/${id}`);
  }

  create(formData: FormData): Observable<ProductWithImages> {
    return this.http.post<ProductWithImages>(this.base, formData);
  }

  update(
    id: string,
    formData: FormData
  ): Observable<ProductWithImages> {

    return this.http.put<ProductWithImages>(
      `${this.base}/${id}`,
      formData
    );
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  addImages(productId: string, formData: FormData): Observable<{ message: string; images: ProductImage[] }> {
    return this.http.post<{ message: string; images: ProductImage[] }>(
      `${this.base}/${productId}/images`, formData
    );
  }

  deleteImage(productId: string, imageId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${productId}/images/${imageId}`);
  }
}
