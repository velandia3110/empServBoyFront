import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { GuideHeroComponent } from './components/guide-hero/guide-hero.component';
import { GuideGalleryComponent } from './components/guide-gallery/guide-gallery.component';
import { GuideCtaComponent } from './components/guide-cta/guide-cta.component';

@Component({
  selector: 'app-guide',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    GuideHeroComponent,
    GuideGalleryComponent,
    GuideCtaComponent
  ],
  templateUrl: './guide.component.html',
  styleUrl: './guide.component.css'
})
export class GuideComponent {}