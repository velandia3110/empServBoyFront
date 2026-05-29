import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsSidebarComponent } from './components/cms-sidebar/cms-sidebar.component';
import { CmsTopBarComponent } from './components/cms-top-bar/cms-top-bar.component';
import { CmsEditorFormComponent } from './components/cms-editor-form/cms-editor-form.component';
import { CmsContentListComponent } from './components/cms-content-list/cms-content-list.component';
import { ArticleWithRelations } from '../../core/models/article.model';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    CommonModule,
    CmsSidebarComponent,
    CmsTopBarComponent,
    CmsEditorFormComponent,
    CmsContentListComponent
  ],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.css'
})
export class CmsComponent {
  view: 'list' | 'editor' = 'list';
  activeSection = 'escritorio';
  articleToEdit: ArticleWithRelations | null = null;

  get isContentSection(): boolean {
    return ['gestion', 'instructivos', 'blog'].includes(this.activeSection);
  }

  onSectionChange(section: string): void {
    this.activeSection = section;
    if (this.view === 'editor') {
      this.view = 'list';
      this.articleToEdit = null;
    }
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
