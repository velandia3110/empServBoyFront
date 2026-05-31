import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsSidebarComponent } from './components/cms-sidebar/cms-sidebar.component';
import { CmsTopBarComponent } from './components/cms-top-bar/cms-top-bar.component';
import { CmsEditorFormComponent } from './components/cms-editor-form/cms-editor-form.component';
import { CmsContentListComponent } from './components/cms-content-list/cms-content-list.component';
import { SettingsService } from '../../core/services/settings.service';
import { ArticleWithRelations } from '../../core/models/article.model';
import { ProductWithImages } from '../../core/models/product.model';
import { CmsProductListComponent } from './components/cms-product-list/cms-product-list.component';
import { CmsProductFormComponent } from './components/cms-product-form/cms-product-form.component';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CmsSidebarComponent,
    CmsTopBarComponent,
    CmsEditorFormComponent,
    CmsContentListComponent,
    CmsProductListComponent,
    CmsProductFormComponent
  ],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.css'
})
export class CmsComponent {
  private settingsService = inject(SettingsService);



  view: 'list' | 'editor' | 'product-editor' = 'list';
  activeSection = 'escritorio';
  articleToEdit: ArticleWithRelations | null = null;
  productToEdit: ProductWithImages | null = null;
  toneladasInput = this.settingsService.toneladas;
  toneladasSaved = false;

  get isContentSection(): boolean {
    return this.activeSection === 'gestion';
  }

  get isProductSection(): boolean {
    return this.activeSection === 'productos';
  }

  onSectionChange(section: string): void {
    this.activeSection = section;
    if (section === 'configuracion') {
      this.toneladasInput = this.settingsService.toneladas;
      this.toneladasSaved = false;
    }
    if (this.view === 'editor') {
      this.view = 'list';
      this.articleToEdit = null;
    }
    if (this.view === 'product-editor') {
      this.view = 'list';
      this.productToEdit = null;
    }
  }
  showProductEditor(): void {
    this.productToEdit = null;
    this.view = 'product-editor';
  }
  editProduct(product: ProductWithImages): void {
    this.productToEdit = product;
    this.view = 'product-editor';
  }
  showList(): void {
    this.articleToEdit = null;
    this.productToEdit = null;
    this.view = 'list';
  }

  saveToneladas(): void {
    this.settingsService.setToneladas(this.toneladasInput);
    this.toneladasSaved = true;
    setTimeout(() => { this.toneladasSaved = false; }, 3000);
  }

  goToGestion(): void {
    this.activeSection = 'gestion';
  }

  showEditor(): void {
    this.articleToEdit = null;
    this.view = 'editor';
  }

  editArticle(article: ArticleWithRelations): void {
    this.articleToEdit = article;
    this.view = 'editor';
  }

  
}
