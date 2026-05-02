import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  features: string[];
}

@Component({
  selector: 'app-section-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-services.component.html',
  styleUrl: './section-services.component.css'
})
export class SectionServicesComponent implements OnInit {
  services: Service[] = [];

  ngOnInit(): void {
    this.loadServices();
  }

  private loadServices(): void {
    this.services = [
      {
        id: 1,
        title: 'Plan Básico',
        description: 'Perfecto para emprendedores y pequeños negocios',
        price: '$29',
        features: ['Hasta 10 usuarios', 'Soporte por email', 'Reportes básicos', 'Integración con 5 herramientas']
      },
      {
        id: 2,
        title: 'Plan Profesional',
        description: 'Ideal para empresas en crecimiento',
        price: '$79',
        features: ['Hasta 50 usuarios', 'Soporte prioritario', 'Reportes avanzados', 'Integración ilimitada']
      },
      {
        id: 3,
        title: 'Plan Enterprise',
        description: 'Solución completa para grandes organizaciones',
        price: 'Personalizado',
        features: ['Usuarios ilimitados', 'Soporte dedicado 24/7', 'API personalizada', 'Seguridad avanzada']
      }
    ];
  }
}
