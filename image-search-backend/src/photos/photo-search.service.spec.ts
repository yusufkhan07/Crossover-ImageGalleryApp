import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';

import { PhotoSearchService } from './photo-search.service';
import { Photo } from './models/photo.model';

jest.mock('./models/photo.model');

describe('PhotoSearchService', () => {
  let service: PhotoSearchService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoSearchService,
        {
          provide: `PhotoRepository`,
          useValue: Photo,
        },
      ],
    }).compile();

    service = module.get<PhotoSearchService>(PhotoSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`should return list page 0 with limit 20`, async () => {
    await service.list(0, 20);

    expect(Photo.findAll).toBeCalledWith({
      limit: 20,
      offset: 0,
    });
  });

  it(`should return list page 1 with limit 20`, async () => {
    await service.list(1, 20);

    expect(Photo.findAll).toBeCalledWith({
      limit: 20,
      offset: 20,
    });
  });

  it(`should return list page 5 with limit 10`, async () => {
    await service.list(5, 10);

    expect(Photo.findAll).toBeCalledWith({
      limit: 10,
      offset: 50,
    });
  });

  it(`should search for description on page 0 with limit 20`, async () => {
    await service.searchByDescription('hello world', 0, 20);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
      limit: 20,
      offset: 0,
    });
  });

  it(`should search for description on page 1 with limit 20`, async () => {
    await service.searchByDescription('hello world', 1, 20);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
      limit: 20,
      offset: 20,
    });
  });

  it(`should search for description on page 100 with limit 10`, async () => {
    await service.searchByDescription('hello world', 100, 10);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
      limit: 10,
      offset: 1000,
    });
  });
});
