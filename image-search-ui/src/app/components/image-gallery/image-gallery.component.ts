import { Component, OnInit } from '@angular/core';

import { PhotoSearchService } from '../../services/photo-search.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  images: Array<any>;
  lastLoadedPage: number;

  constructor(private readonly searchService: PhotoSearchService) {}

  ngOnInit(): void {
    this.images = [
      {
        id: 1,
        description: 'accusamus beatae ad facilis cum similique qui sunt',
        url: 'https://via.placeholder.com/600/92c952',
      },
      {
        id: 2,
        description: 'reprehenderit est deserunt velit ipsam',
        url: 'https://via.placeholder.com/600/771796',
      },
      {
        id: 3,
        description: 'officia porro iure quia iusto qui ipsa ut modi',
        url: 'https://via.placeholder.com/600/24f355',
      },
      {
        id: 4,
        description:
          'culpa odio esse rerum omnis laboriosam voluptate repudiandae',
        url: 'https://via.placeholder.com/600/d32776',
      },
    ];
  }

  onScroll() {
    console.log('scrolled');
  }
}
