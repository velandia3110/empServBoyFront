import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionServicesComponent } from '../section-services/section-services.component';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-section-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-features.component.html',
  styleUrls: ['./section-features.component.css']
})
export class SectionFeaturesComponent implements OnInit {
  products: Product[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.products = [
      {
        id: 1,
        title: 'Sistema de Filtración',
        description: 'Tecnología avanzada para purificación de agua con máxima eficiencia y durabilidad.',
        image: '/assets/filtro.jpg'
      },
      {
        id: 2,
        title: 'Abono Orgánico',
        description: 'Fertilizante natural que mejora la calidad del suelo y aumenta la productividad agrícola.',
        image: '/assets/abono organico.jpg'
      },
      {
        id: 3,
        title: 'Gestión de Residuos',
        description: 'Soluciones sostenibles para el manejo y reciclaje de residuos industriales.',
        image: '/assets/residuos.jpg'
      }
    ];
  }
}
