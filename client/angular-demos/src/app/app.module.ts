// ng
import { BrowserModule } from '@angular/platform-browser'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule,
  MatSnackBarModule,
} from '@angular/material'

// app services
import { BackendService } from './backend.service'
import { UIService } from './ui.service'

// app routes
import { MaterialsPageComponent } from './materials-page/materials-page.component'
import { ModelsPageComponent } from './models-page/models-page.component'
import { HomePageComponent } from './home-page/home-page.component'
import { ImagesPageComponent } from './images-page/images-page.component'
import { UsersPageComponent } from './users-page/users-page.component'
import { CustomersPageComponent } from './customers-page/customers-page.component'
import { TagsPageComponent } from './tags-page/tags-page.component';

// app components
import { AppComponent } from './app.component'
import { ContentWidthComponent } from './content-width/content-width.component'
import { MaterialDetailComponent } from './material-detail/material-detail.component'
import { FileDropComponent } from './file-drop/file-drop.component';
import { ModalOverlayComponent } from './modal-overlay/modal-overlay.component';
import { ResponsiveCardComponent } from './responsive-card/responsive-card.component'

// routes
const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'models/:param', component: ModelsPageComponent },
  { path: 'materials/:param', component: MaterialsPageComponent},
  { path: 'images/:param', component: ImagesPageComponent },
  { path: 'users/:param', component: UsersPageComponent },
  { path: 'customers/:param', component: CustomersPageComponent },
  { path: 'tags/:param', component: TagsPageComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    MaterialsPageComponent,
    MaterialDetailComponent,
    FileDropComponent,
    ModelsPageComponent,
    HomePageComponent,
    ImagesPageComponent,
    UsersPageComponent,
    CustomersPageComponent,
    TagsPageComponent,
    ContentWidthComponent,
    ModalOverlayComponent,
    ResponsiveCardComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  providers: [
    BackendService,
    UIService,
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule { }
