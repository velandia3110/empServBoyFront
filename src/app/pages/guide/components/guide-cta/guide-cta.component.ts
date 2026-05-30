import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guide-cta',
  standalone: true,
  imports: [],
  templateUrl: './guide-cta.component.html',
  styleUrl: './guide-cta.component.css'
})
export class GuideCtaComponent {
  private router = inject(Router);

  goToContact(): void {
    this.router.navigate(['/'], { fragment: 'contacto' });
  }
}
