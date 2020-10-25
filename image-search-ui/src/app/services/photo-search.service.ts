import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoSearchService {
  constructor() {}

  async search(): Promise<
    Array<{
      id: number;
      description: string;
      url: string;
      size: number;
      mimetype: string;
    }>
  > {
    return [];
  }
}
