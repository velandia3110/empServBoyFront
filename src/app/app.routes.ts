import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GuideComponent } from './pages/guide/guide.component';
import { CmsComponent } from './pages/cms/cms.component';

export const routes: Routes = [
  // Ruta para la página principal (path vacío = raíz del sitio)
  {
    path: '',
    component: HomeComponent
  },
  // Ruta para la página de instructivo
  {
    path: 'guide',
    component: GuideComponent
  },
  // Ruta para el CMS Admin Panel
  {
    path: 'cms',
    component: CmsComponent
  },
  // Ruta comodín: si alguien escribe una URL que no existe,
  // lo redirige a la página principal
  {
    path: '**',
    redirectTo: ''
  }
];