import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnnualProcessedWaste } from '../models/waste.model';

@Injectable({ providedIn: 'root' })
export class WasteService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/waste`;

  getLatest(): Observable<AnnualProcessedWaste> {
    return this.http.get<AnnualProcessedWaste>(`${environment.apiUrl}/waste/latest`);
  }

  getAll(): Observable<AnnualProcessedWaste[]> {
    return this.http.get<AnnualProcessedWaste[]>(this.base);
  }

  getById(id: string): Observable<AnnualProcessedWaste> {
    return this.http.get<AnnualProcessedWaste>(`${this.base}/${id}`);
  }

  create(year: string, processedWaste: number): Observable<AnnualProcessedWaste> {
    return this.http.post<AnnualProcessedWaste>(this.base, { year, processedWaste });
  }

  update(id: string, payload: { year?: string; processedWaste?: number }): Observable<AnnualProcessedWaste> {
    return this.http.put<AnnualProcessedWaste>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }
}
