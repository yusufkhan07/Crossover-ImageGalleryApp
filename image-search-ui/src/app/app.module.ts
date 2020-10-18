import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageUploadFormComponent } from './components/image-upload-form/image-upload-form.component';

@NgModule({
  declarations: [AppComponent, ImageUploadComponent, ImageUploadFormComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
