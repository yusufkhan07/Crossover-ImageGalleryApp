import { TestBed } from '@angular/core/testing';

import { PhotoSearchService } from './photo-search.service';

describe('PhotoSearchService', () => {
  let service: PhotoSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
