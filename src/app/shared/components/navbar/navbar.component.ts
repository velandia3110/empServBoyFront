import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
// RouterLink: permite usar routerLink="..." en el HTML
// RouterLinkActive: permite usar routerLinkActive="..." para estilos activos
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,       // ← NUEVO: necesario para routerLink
    RouterLinkActive  // ← NUEVO: necesario para routerLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;
  scrolled = false;

  navLinks = [
    { label: 'Inicio', routerLink: '/', exact: true },
    { label: 'Instructivo', routerLink: '/guide', exact: false },
    { label: 'Productos', href: '#products' },
    { label: 'Contacto', href: '#contacto' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}