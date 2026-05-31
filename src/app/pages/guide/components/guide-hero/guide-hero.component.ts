import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface CarouselSlide {
  image: string;
  alt: string;
}

@Component({
  selector: 'app-guide-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide-hero.component.html',
  styleUrl: './guide-hero.component.css'
})
export class GuideHeroComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  slides: CarouselSlide[] = [
    { image: 'assets/banner-web-1.jpeg',           alt: 'Bio-insumos agrícolas - El planeta necesita más cultivos orgánicos' },
    { image: 'assets/Banner-web-capa-ozono.png',   alt: 'Día internacional de la preservación de la capa de ozono' },
    { image: 'assets/carrusel.jpeg',             alt: 'Bio-insumos agrícolas - El planeta necesita más cultivos orgánicos' },
  ];

  current = 0;
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  prev(): void {
    this.current = (this.current - 1 + this.slides.length) % this.slides.length;
    this.resetAutoPlay();
  }

  next(): void {
    this.current = (this.current + 1) % this.slides.length;
    this.resetAutoPlay();
  }

  goTo(index: number): void {
    this.current = index;
    this.resetAutoPlay();
  }

  pauseAutoPlay(): void {
    this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoPlay();
    }
  }

  private startAutoPlay(): void {
    this.timer = setInterval(() => {
      this.current = (this.current + 1) % this.slides.length;
    }, 5000);
  }

  private stopAutoPlay(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoPlay();
    }
  }
}
