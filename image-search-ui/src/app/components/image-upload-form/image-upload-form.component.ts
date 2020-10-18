import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.scss'],
})
export class ImageUploadFormComponent implements OnInit {
  file: File;
  description: string;

  constructor() {}

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
    console.log('form submitted');
    console.log(this.file);
    console.log(this.description);
  };

  validateFile = (file?: File): boolean => {
    let valid: boolean = true;

    return valid;
  };
}
