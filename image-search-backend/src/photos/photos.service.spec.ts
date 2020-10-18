import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import * as aws from 'aws-sdk';

import { PhotosService } from './photos.service';
import { Photo } from './models/photo.model';

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const sequelize = new Sequelize({
      database: 'some_db',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      logging: false,
      models: [Photo],
    });

    await sequelize.sync({
      force: true,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: `PhotoRepository`,
          useValue: sequelize.model(Photo.getTableName() as string),
        },
        {
          provide: `aws`,
          useFactory: async () => {
            return aws;
          },
        },
        PhotosService,
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload to S3 after RDS op', () => {
    fail();
  });

  it(`should upload photo to S3 when RDS op is successfull`, async () => {
    const created = await service.create({});

    expect(created).toBeInstanceOf(Photo);
  });

  it(`should not upload photo to S3 when RDS op fails`, () => {
    fail();
  });

  it(`should rollback RDS op when S3 upload fails`, () => {
    fail();
  });
});
