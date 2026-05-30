import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsSidebarComponent } from './components/cms-sidebar/cms-sidebar.component';
import { CmsTopBarComponent } from './components/cms-top-bar/cms-top-bar.component';
import { CmsEditorFormComponent } from './components/cms-editor-form/cms-editor-form.component';
import { CmsContentListComponent } from './components/cms-content-list/cms-content-list.component';
import { SettingsService } from '../../core/services/settings.service';
import { ArticleWithRelations } from '../../core/models/article.model';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CmsSidebarComponent,
    CmsTopBarComponent,
    CmsEditorFormComponent,
    CmsContentListComponent
  ],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.css'
})
export class CmsComponent {
  private settingsService = inject(SettingsService);

  view: 'list' | 'editor' = 'list';
  activeSection = 'escritorio';
  articleToEdit: ArticleWithRelations | null = null;

  toneladasInput  = this.settingsService.toneladas;
  toneladasSaved  = false;

  get isContentSection(): boolean {
    return this.activeSection === 'gestion';
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

  showList(): void {
    this.articleToEdit = null;
    this.view = 'list';
  }
}
