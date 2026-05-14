import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  activeItem = 'gestion';

  navItems: NavItem[] = [
    { id: 'escritorio', label: 'Escritorio' },
    { id: 'gestion', label: 'Gestión de Contenidos' },
    { id: 'instructivos', label: 'Instructivos' },
    { id: 'blog', label: 'Blog' },
    { id: 'configuracion', label: 'Configuración' }
  ];

  setActive(id: string): void {
    this.activeItem = id;
  }
}
