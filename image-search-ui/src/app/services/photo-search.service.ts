import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoSearchService {
  constructor() {}

  async search(
    curPage: number
  ): Promise<
    Array<{
      id: number;
      description: string;
      url: string;
      size: number;
      mimetype: string;
    }>
  > {
    // put in real API call
    return [
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
    ] as any;
  }
}
