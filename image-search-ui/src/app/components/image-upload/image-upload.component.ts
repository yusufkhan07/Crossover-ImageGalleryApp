import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @Input() valid: boolean;

  @Output() fileChange = new EventEmitter();

  fileName: string;

  constructor() {}

  ngOnInit(): void {}

  handleFileChange = (files: FileList) => {
    this.fileChange.emit(files[0]);

    if (files && files.length > 0) {
      this.fileName = files[0].name;
    } else {
      this.fileName = undefined;
    }
  };
}
