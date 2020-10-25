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

  it(`should return all files`, async () => {
    await service.list();

    expect(Photo.findAll).toBeCalledWith();
  });

  it(`should search for description`, async () => {
    await service.searchByDescription('hello world');

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
    });
  });
});
