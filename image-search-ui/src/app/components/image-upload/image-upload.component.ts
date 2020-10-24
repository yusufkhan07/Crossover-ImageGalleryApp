import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @Input() onChange: (files: FileList) => void;

  fileName: string;

  constructor() {}

  ngOnInit(): void {}

  setSelectedFileName = (files: FileList) => {
    if (files && files.length > 0) {
      this.fileName = files[0].name;
    } else {
      this.fileName = undefined;
    }
  };
}
