import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {
  @Input() onChange: (files: FileList) => void;

  constructor() {}

  ngOnInit(): void {}
}
