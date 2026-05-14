import { Component } from '@angular/core';
import { CmsSidebarComponent } from './components/cms-sidebar/cms-sidebar.component';
import { CmsTopBarComponent } from './components/cms-top-bar/cms-top-bar.component';
import { CmsEditorFormComponent } from './components/cms-editor-form/cms-editor-form.component';

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [
    CmsSidebarComponent,
    CmsTopBarComponent,
    CmsEditorFormComponent
  ],
  templateUrl: './cms.component.html',
  styleUrl: './cms.component.css'
})
export class CmsComponent {}
