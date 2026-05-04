import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz para las tarjetas grandes (featured)
interface FeaturedCard {
  step: string;
  title: string;
  image: string;
  bgClass: string;
  labelClass: string;
  icon?: string;
}

// Interfaz para las tarjetas pequeñas (secondary)
interface SecondaryCard {
  title: string;
  description: string;
  image: string;
  badge?: string;
  isVideo?: boolean;
  cardBg?: string;
  titleColor?: string;
  checks?: string[];
}

@Component({
  selector: 'app-guide-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide-gallery.component.html',
  styleUrl: './guide-gallery.component.css'
})
export class GuideGalleryComponent implements OnInit {

  // Tarjetas grandes superiores
  featuredCards: FeaturedCard[] = [];

  // Tarjetas medianas inferiores
  secondaryCards: SecondaryCard[] = [];

  ngOnInit(): void {
    this.loadFeaturedCards();
    this.loadSecondaryCards();
  }

  private loadFeaturedCards(): void {
    this.featuredCards = [
      {
        step: 'Paso 01: Clasificación',
        title: 'Manual de Separación en Origen',
        image: 'assets/separacion.jpg',       // ← reemplazar con tu imagen
        bgClass: 'bg-blue-900',
        labelClass: 'text-green-400',
        icon: undefined
      },
      {
        step: 'Paso 02: Purificación',
        title: 'Filtrado Circular de Lixiviados',
        image: 'assets/filtrado.jpg',          // ← reemplazar con tu imagen
        bgClass: 'bg-gray-800',
        labelClass: 'text-blue-300',
        icon: '+'
      }
    ];
  }

  private loadSecondaryCards(): void {
    this.secondaryCards = [
      {
        title: 'Guía de Abono Maduro',
        description: 'Instrucciones técnicas para identificar el punto exacto de maduración del compostaje industrial.',
        image: 'assets/abono-maduro.jpg',      // ← reemplazar con tu imagen
        badge: undefined,
        isVideo: false,
        cardBg: 'bg-white',
        titleColor: 'text-blue-900'
      },
      {
        title: 'Optimización de Rutas de Recolección',
        description: 'Duración: 4:21 min  •  Nivel: Técnico',
        image: 'assets/camion.jpg',            // ← puedes usar assets/camion.jpg que ya tienes
        badge: 'Cápsula de Video',
        isVideo: true,
        cardBg: 'bg-white',
        titleColor: 'text-blue-900'
      },
      {
        title: '100% Circular',
        description: 'Cómo cerramos el ciclo de nutrientes en cada proceso de EmpServBoy.',
        image: 'assets/circular.jpg',          // ← reemplazar con tu imagen
        badge: undefined,
        isVideo: false,
        cardBg: 'bg-blue-900',
        titleColor: 'text-white',
        checks: ['Cero Desperdicio', 'Bio-Energía']
      }
    ];
  }
}