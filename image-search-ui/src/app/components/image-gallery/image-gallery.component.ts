import { Component, OnInit } from '@angular/core';

import { PhotoSearchService } from '../../services/photo-search.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
})
export class ImageGalleryComponent implements OnInit {
  images: Array<{
    id: number;
    description: string;
    url: string;
    size: number;
    mimetype: string;
  }>;
  lastLoadedPage: number;

  constructor(private readonly searchService: PhotoSearchService) {}

  private loadImages = async () => {
    const pageToLoad =
      this.lastLoadedPage === undefined ? 0 : this.lastLoadedPage + 1;

    // load images
    try {
      const newImages = await this.searchService.search(pageToLoad);

      this.images = [...(this.images || []), ...newImages];
    } catch {
      return alert('error loading images');
    }

    this.lastLoadedPage = pageToLoad;
    return this.images;
  };

  async ngOnInit(): Promise<void> {
    await this.loadImages();
  }

  onScroll = async () => {
    await this.loadImages();
  };
}
