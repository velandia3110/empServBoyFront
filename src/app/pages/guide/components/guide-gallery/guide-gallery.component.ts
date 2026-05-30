import {
  Component, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef, inject, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesService } from '../../../../core/services/articles.service';
import { SettingsService } from '../../../../core/services/settings.service';
import { ArticleWithRelations } from '../../../../core/models/article.model';

interface FeaturedCard {
  step: string;
  title: string;
  image: string;
  bgClass: string;
  labelClass: string;
  icon?: string;
  article: ArticleWithRelations;
}

interface SecondaryCard {
  title: string;
  description: string;
  image: string;
  badge?: string;
  isVideo?: boolean;
  cardBg?: string;
  titleColor?: string;
  article: ArticleWithRelations;
}

const BG_CLASSES    = ['bg-blue-900', 'bg-gray-800'];
const LABEL_CLASSES = ['text-green-400', 'text-blue-300'];
const FALLBACK_IMG  = 'assets/guide-bg.jpg';

@Component({
  selector: 'app-guide-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide-gallery.component.html',
  styleUrl: './guide-gallery.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideGalleryComponent implements OnInit {
  private articlesService = inject(ArticlesService);
  private settingsService = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);

  featuredCards: FeaturedCard[]   = [];
  secondaryCards: SecondaryCard[] = [];
  loading   = true;
  errorMsg  = '';
  toneladas$ = this.settingsService.toneladas$;

  // ── Drawer ──────────────────────────────
  selectedArticle: ArticleWithRelations | null = null;
  drawerOpen = false;

  @HostListener('document:keydown.escape')
  closeDrawer() {
    this.drawerOpen = false;
    this.selectedArticle = null;
    this.cdr.markForCheck();
  }

  openArticle(article: ArticleWithRelations) {
    this.selectedArticle = article;
    this.drawerOpen = true;
    this.cdr.markForCheck();
  }


  ngOnInit(): void {
    this.articlesService.getAll().subscribe({
      next: articles => {
        this.featuredCards = articles.slice(0, 2).map((a, i) => ({
          step:       `Paso ${String(i + 1).padStart(2, '0')}`,
          title:      a.title,
          image:      this.imageOf(a),
          bgClass:    BG_CLASSES[i % 2],
          labelClass: LABEL_CLASSES[i % 2],
          icon:       i > 0 ? '+' : undefined,
          article:    a 
        }));

        this.secondaryCards = articles.slice(2).map(a => ({
          title:       a.title,
          description: this.textOf(a),
          image:       this.imageOf(a),
          badge:       this.hasVideo(a) ? 'Video' : undefined,
          isVideo:     this.hasVideo(a),
          cardBg:      'bg-white',
          titleColor:  'text-blue-900',
          article:    a 
        }));

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading  = false;
        this.errorMsg = 'No se pudieron cargar los instructivos.';
        this.cdr.markForCheck();
      }
    });
  }

  public imageOf(a: ArticleWithRelations): string {
    return a.multimedia.find(m => m.type === 'IMAGE')?.resourceUrl ?? FALLBACK_IMG;
  }

  videoOf(a: ArticleWithRelations): string | null {
    return a.multimedia.find(m => m.type === 'VIDEO')?.resourceUrl ?? null;
  }

  public textOf(a: ArticleWithRelations): string {
    const t = a.multimedia.find(m => m.type === 'TEXT')?.content ?? '';
    return t;
  }

  public hasVideo(a: ArticleWithRelations): boolean {
    return a.multimedia.some(m => m.type === 'VIDEO');
  }
}
