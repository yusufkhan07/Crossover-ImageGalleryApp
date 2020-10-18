import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.scss'],
})
export class ImageUploadFormComponent implements OnInit {
  private readonly formUrl = '';

  public file: File;
  public description: string;
  public status: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  handleFileChange = (files: FileList) => {
    const file = files[0];

    const isValid = this.validateFile(file);

    if (isValid) {
      this.file = file;
      console.log('valid file');
    } else {
      console.log('invalid file');
    }
  };

  handleSubmit = () => {
    this.http
      .post<unknown>(this.formUrl, {
        file: this.file,
        description: this.description,
      })
      .subscribe(
        (val) => {
          this.status = 'Submitted Successfully';
        },
        (err) => {
          this.status = 'Submission Error';
        }
      );
  };

  validateFile = (file?: File): boolean => {
    // validate files only if file exist
    if (!file) {
      return true;
    }

    // Allow files < 500 KB & PNG or JPEG types.

    if (
      Math.round(file.size / 1024) > 500 ||
      (file.type !== 'image/jpeg' && file.type !== 'image/png')
    ) {
      return false;
    }

    return true;
  };
}
