import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageUploadFormComponent } from './components/image-upload-form/image-upload-form.component';

const routes: Routes = [{ path: 'form', component: ImageUploadFormComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
