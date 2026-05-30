import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const TONELADAS_KEY = 'empservboy_toneladas';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private platformId = inject(PLATFORM_ID);

  private toneladasSubject = new BehaviorSubject<string>('1.8');
  readonly toneladas$ = this.toneladasSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(TONELADAS_KEY);
      if (stored) this.toneladasSubject.next(stored);
    }
  }

  get toneladas(): string {
    return this.toneladasSubject.value;
  }

  setToneladas(value: string | number): void {
    const clean = String(value).trim() || '1.8';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(TONELADAS_KEY, clean);
    }
    this.toneladasSubject.next(clean);
  }
}
