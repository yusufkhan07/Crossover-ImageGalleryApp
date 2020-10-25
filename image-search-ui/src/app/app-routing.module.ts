import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageUploadFormComponent } from './components/image-upload-form/image-upload-form.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: ImageGalleryComponent,
  },
  { path: 'form', component: ImageUploadFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
