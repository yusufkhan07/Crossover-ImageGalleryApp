import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-upload-form',
  templateUrl: './image-upload-form.component.html',
  styleUrls: ['./image-upload-form.component.scss'],
})
export class ImageUploadFormComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  handleFileChange = (files: FileList) => {
    const file = files[0];

    const isValid = this.validateFile(file);

    if (isValid) {
      console.log('valid file');
    } else {
      console.log('invalid file');
    }
  };

  handleSubmit = () => {
    console.log('form submitted');
  };

  validateFile = (file?: File): boolean => {
    let valid: boolean = true;

    return valid;
  };
}
