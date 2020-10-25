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
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.list(0, 20);

    expect(Photo.findAll).toBeCalledWith({
      limit: 20,
      offset: 0,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should return list page 1 with limit 20`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.list(1, 20);

    expect(Photo.findAll).toBeCalledWith({
      limit: 20,
      offset: 20,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should return list page 5 with limit 10`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.list(5, 10);

    expect(Photo.findAll).toBeCalledWith({
      limit: 10,
      offset: 50,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for description on page 0 with limit 20`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchByDescription(
      'hello world',
      0,
      20,
    );

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
      limit: 20,
      offset: 0,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for description on page 1 with limit 20`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchByDescription(
      'hello world',
      1,
      20,
    );

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
      limit: 20,
      offset: 20,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for description on page 100 with limit 10`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchByDescription(
      'hello world',
      100,
      10,
    );

    expect(Photo.findAll).toBeCalledWith({
      where: {
        description: {
          [Op.iLike]: 'hello world',
        },
      },
      limit: 10,
      offset: 1000,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for size on page 0 with limit 20`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchBySize(1672, 0, 20);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        size: 1672,
      },
      limit: 20,
      offset: 0,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for size on page 3 with limit 10`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchBySize(1672, 3, 10);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        size: 1672,
      },
      limit: 10,
      offset: 30,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for size on page 231 with limit 10`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchBySize(1672, 231, 10);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        size: 1672,
      },
      limit: 10,
      offset: 2310,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for mimetype on page 0 with limit 20`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchByMimetype('image/png', 0, 20);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        mimetype: 'image/png',
      },
      limit: 20,
      offset: 0,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for mimetype on page 3 with limit 10`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchByMimetype('image/jpeg', 3, 10);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        mimetype: 'image/jpeg',
      },
      limit: 10,
      offset: 30,
    });
    expect(serviceResult).toBe(findAllResult);
  });

  it(`should search for mimetype on page 231 with limit 10`, async () => {
    const findAllResult = [{ id: 1 }, { id: 2 }];

    // @ts-ignore
    jest.spyOn(Photo, 'findAll').mockImplementation((...args) => findAllResult);

    const serviceResult = await service.searchByMimetype('image/png', 231, 10);

    expect(Photo.findAll).toBeCalledWith({
      where: {
        mimetype: 'image/png',
      },
      limit: 10,
      offset: 2310,
    });
    expect(serviceResult).toBe(findAllResult);
  });
});
