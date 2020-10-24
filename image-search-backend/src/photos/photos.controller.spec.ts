import { Test, TestingModule } from '@nestjs/testing';
import { PhotosController } from './photos.controller';

import { PhotoCreatorService } from './photo-creator.service';
import { PhotoDto } from './dto/photo.dto';

describe('PhotosController', () => {
  let controller: PhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotosController],
      providers: [
        {
          provide: PhotoCreatorService,
          useValue: {
            create: () => {
              return new PhotoDto();
            },
          },
        },
      ],
    }).compile();

    controller = module.get<PhotosController>(PhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return the newly created Photo', async () => {
      const created = await controller.create(
        {
          description: 'hello',
          file: {
            size: 1,
            mimetype: 'image/png',
          } as any,
        },
        {
          description: '',
        },
      );

      expect(created).toBeInstanceOf(PhotoDto);
    });
  });
});
