import { Test, TestingModule } from '@nestjs/testing';
import { PhotosController } from './photos.controller';

import { PhotoCreatorService } from './photo-creator.service';
import { PhotoSearchService } from './photo-search.service';
import { PhotoDto } from './dto/photo.dto';

jest.mock('./photo-search.service.ts');
jest.mock('./photo-creator.service');

describe('PhotosController', () => {
  let controller: PhotosController;
  let photoSearchService: PhotoSearchService;
  let photoCreatorService: PhotoCreatorService;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotosController],
      providers: [PhotoSearchService, PhotoCreatorService],
    }).compile();

    controller = module.get(PhotosController);
    photoSearchService = module.get(PhotoSearchService);
    photoCreatorService = module.get(PhotoCreatorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the newly created Photo', async () => {
      jest
        .spyOn(photoCreatorService, 'create')
        .mockImplementation(async (...args) => new PhotoDto());

      const created = await controller.create(
        {
          size: 1,
          mimetype: 'image/png',
        } as any,
        {
          description: 'hello',
        },
      );

      expect(photoCreatorService.create).toBeCalledWith(
        expect.objectContaining({
          description: 'hello',
          file: {
            size: 1,
            mimetype: 'image/png',
          },
        }),
      );
      expect(created).toBeInstanceOf(PhotoDto);
    });
  });

  describe('list', () => {
    it('should return photos with default pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'list')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list();

      expect(photoSearchService.list).toBeCalledWith(0, 20);
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with received pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'list')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(5, 13);

      expect(photoSearchService.list).toBeCalledWith(5, 13);
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with description & default pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'searchByDescription')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(void 0, void 0, 'hello');

      expect(photoSearchService.searchByDescription).toBeCalledWith(
        'hello',
        0,
        20,
      );
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with description & received pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'searchByDescription')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(17, 29, 'hello');

      expect(photoSearchService.searchByDescription).toBeCalledWith(
        'hello',
        17,
        29,
      );
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with mimetype & default pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'searchByMimetype')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(
        void 0,
        void 0,
        void 0,
        'image/png',
      );

      expect(photoSearchService.searchByMimetype).toBeCalledWith(
        'image/png',
        0,
        20,
      );
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with mimetype & received pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'searchByMimetype')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(
        13,
        10,
        void 0,
        'image/jpeg',
      );

      expect(photoSearchService.searchByMimetype).toBeCalledWith(
        'image/jpeg',
        13,
        10,
      );
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with size & default pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'searchBySize')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(
        void 0,
        void 0,
        void 0,
        void 0,
        1024,
      );

      expect(photoSearchService.searchBySize).toBeCalledWith(1024, 0, 20);
      expect(controllerResponse).toBe(result);
    });

    it('should return photos with size & received pagination parameters', async () => {
      const result: PhotoDto[] = [
        {
          createdAt: new Date('2012-01-01'),
          updatedAt: new Date('2012-01-01'),
          description: 'hello world',
          id: 1,
          s3Key: 'random-guid',
        },
      ];

      jest
        .spyOn(photoSearchService, 'searchBySize')
        .mockImplementation(async (...args) => result);

      const controllerResponse = await controller.list(
        10,
        20,
        void 0,
        void 0,
        1024,
      );

      expect(photoSearchService.searchBySize).toBeCalledWith(1024, 10, 20);
      expect(controllerResponse).toBe(result);
    });
  });
});
