import { Component } from '@angular/core';
import { CmsSidebarComponent } from './components/cms-sidebar/cms-sidebar.component';
import { CmsTopBarComponent } from './components/cms-top-bar/cms-top-bar.component';
import { CmsEditorFormComponent } from './components/cms-editor-form/cms-editor-form.component';
import { CmsContentListComponent } from './components/cms-content-list/cms-content-list.component';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
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

  showEditor(): void { this.view = 'editor'; }
  showList(): void  { this.view = 'list';   }
}
