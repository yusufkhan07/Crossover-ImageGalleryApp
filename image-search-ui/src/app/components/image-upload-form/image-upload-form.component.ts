import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.scss'],
})
export class ImageUploadFormComponent implements OnInit {
  private readonly formUrl = 'http://localhost:3000/photos';

  file: File;

  description: string;

  formSubmissionStatus: boolean;
  formSubmissionStatusText: string;

  private get valid(): boolean {
    return (
      this.validateFile(this.file) && this.validateDescription(this.description)
    );
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  handleFileChange = (file: File) => {
    this.file = file;
  };

  handleDescriptionChange = (description: string) => {};

  handleSubmit = (form) => {
    // if (!this.valid) {
    //   return alert(`form is not valid`);
    // }
    this.formSubmissionStatusText = undefined;

    const formData = new FormData();

    if (this.file) {
      formData.append('photo', this.file, this.file.name);
    }
    formData.append('description', this.description);

    this.http.post<unknown>(this.formUrl, formData).subscribe(
      (val) => {
        this.formSubmissionStatusText = 'Success';
        this.formSubmissionStatus = true;
      },
      (err) => {
        this.formSubmissionStatusText = 'Failed';
        this.formSubmissionStatus = false;
      }
    );
  };

  validateFile = (file: File): boolean => {
    if (file == null) {
      return false;
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

  validateDescription = (description: string) => {
    return description && description.length > 0;
  };
}
