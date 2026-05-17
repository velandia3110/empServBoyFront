import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GuideComponent } from './pages/guide/guide.component';
import { CmsComponent } from './pages/cms/cms.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'guide',
    component: GuideComponent
  },
  {
    path: 'cms',
    component: CmsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];