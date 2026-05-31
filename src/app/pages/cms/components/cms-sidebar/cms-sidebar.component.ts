import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface NavItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-cms-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cms-sidebar.component.html',
  styleUrl: './cms-sidebar.component.css'
})
export class CmsSidebarComponent {
  @Input() activeItem = 'escritorio';
  @Output() sectionChange = new EventEmitter<string>();

  navItems: NavItem[] = [
    { id: 'escritorio', label: 'Escritorio' },
    { id: 'gestion', label: 'Gestión de Contenidos' },
    { id: 'configuracion', label: 'Configuración' },
    { id: 'productos', label: 'Productos' },
  ];

  constructor(private router: Router) {}

  setActive(id: string): void {
    this.sectionChange.emit(id);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.router.navigate(['/login']);
  }
}
