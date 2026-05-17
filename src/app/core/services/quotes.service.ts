import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuoteWithRelations, QuoteStatus, CreateQuotePayload } from '../models/quote.model';

@Injectable({ providedIn: 'root' })
export class QuotesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/quotes`;

  send(payload: CreateQuotePayload): Observable<{ message: string; quoteId: string }> {
    return this.http.post<{ message: string; quoteId: string }>(this.base, payload);
  }

  getAll(status?: QuoteStatus): Observable<QuoteWithRelations[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<QuoteWithRelations[]>(this.base, { params });
  }

  getById(id: string): Observable<QuoteWithRelations> {
    return this.http.get<QuoteWithRelations>(`${this.base}/${id}`);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

  updateStatus(id: string, status: QuoteStatus): Observable<QuoteWithRelations> {
    return this.http.patch<QuoteWithRelations>(`${this.base}/${id}/status`, { status });
  }
}
