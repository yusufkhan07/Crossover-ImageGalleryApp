import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import * as AWSMock from 'aws-sdk-mock';
import * as aws from 'aws-sdk';

import { PhotosService, err_messages } from './photos.service';
import { Photo } from './models/photo.model';
import { NotImplementedException } from '@nestjs/common';

let sequelize: Sequelize;
let s3Storage: {};

beforeEach(async () => {
  const testDbConfig: SequelizeOptions = {
    database: 'some_db',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    logging: false,
    models: [Photo],
  };

  sequelize = new Sequelize(testDbConfig);

  await sequelize.sync({
    force: true,
  });
});

describe('PhotosService', () => {
  let service: PhotosService;
  let module: TestingModuleBuilder;

  beforeEach(async () => {
    s3Storage = {};

    module = Test.createTestingModule({
      providers: [
        {
          provide: `PhotoRepository`,
          useValue: sequelize.model(Photo.getTableName() as string),
        },
        {
          provide: `aws`,
          useFactory: async () => {
            AWSMock.restore('S3');

            AWSMock.setSDKInstance(aws);

            // mock S3.upload method
            AWSMock.mock(
              'S3',
              'upload',
              (
                params: aws.S3.PutObjectRequest,
                callback: (err, data: aws.S3.ManagedUpload.SendData) => unknown,
              ) => {
                s3Storage[params.Key] = params.Body;

                callback(null, {
                  Location: 'some-location',
                  ETag: 'd41d8cd98f00b204e9800991ecf8427e',
                  Key: params.Key,
                  Bucket: params.Bucket,
                });
              },
            );

            return aws;
          },
        },
        PhotosService,
      ],
    });

    service = (await module.compile()).get<PhotosService>(PhotosService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('When creating a photo and file type is valid, it should have size less than or equal to 500kb', async () => {
    const created0Kb = await service.create({
      description: 'hello',
      file: {
        size: 0 * 1024,
        mimetype: 'image/png',
      } as any,
    });

    const created250Kb = await service.create({
      description: 'hello',
      file: {
        size: 250 * 1024,
        mimetype: 'image/png',
      } as any,
    });

    const created499Kb = await service.create({
      description: 'hello',
      file: {
        size: 499 * 1024,
        mimetype: 'image/png',
      } as any,
    });

    const created500Kb = await service.create({
      description: 'hello',
      file: {
        size: 500 * 1024,
        mimetype: 'image/png',
      } as any,
    });

    expect(created0Kb).toBeInstanceOf(Photo);
    expect(created250Kb).toBeInstanceOf(Photo);
    expect(created499Kb).toBeInstanceOf(Photo);
    expect(created500Kb).toBeInstanceOf(Photo);
  });

  it('When creating a photo and file type is valid and file size is greater han 500kb, it should throw a BadRqeuestException', async () => {
    await expect(async () => {
      await service.create({
        description: 'hello',
        file: {
          size: 501 * 1024,
          mimetype: 'image/png',
        } as any,
      });
    }).rejects.toThrow(err_messages.invalid_file_size);
  });

  it('When creating a photo and file size is valid, it should have a type of png or jpeg', async () => {
    const createdPng = await service.create({
      description: 'hello',
      file: {
        size: 1,
        mimetype: 'image/png',
      } as any,
    });

    const createdJpeg = await service.create({
      description: 'hello',
      file: {
        size: 2,
        mimetype: 'image/png',
      } as any,
    });

    expect(createdPng).toBeInstanceOf(Photo);
    expect(createdJpeg).toBeInstanceOf(Photo);
  });

  it('When creating a photo and file size is valid but file type is not png or jpeg, it should throw an exception', async () => {
    await expect(async () => {
      await service.create({
        description: 'hello',
        file: {
          size: 1,
          mimetype: 'image/gif',
        } as any,
      });
    }).rejects.toThrow(err_messages.invalid_file_type);
  });

  it('When creating a photo is succesfull, it should exist in db & s3', async () => {
    const dbPhotosCountStart = await service.count();
    const s3ObjectsCount = Object.keys(s3Storage).length;

    await service.create({
      description: 'hello',
      file: {
        size: 0,
        mimetype: 'image/png',
      } as any,
    });

    const dbPhotosCountEnd = await service.count();

    expect(dbPhotosCountEnd).toEqual(dbPhotosCountStart + 1);
    expect(Object.keys(s3Storage).length).toEqual(s3ObjectsCount + 1);
  });
});

describe('PhotosServiceWithFailingS3', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: `PhotoRepository`,
          useValue: sequelize.model(Photo.getTableName() as string),
        },
        {
          provide: `aws`,
          useFactory: async () => {
            AWSMock.restore('S3');
            AWSMock.setSDKInstance(aws);

            // mock S3.upload method
            AWSMock.mock(
              'S3',
              'upload',
              (
                params: aws.S3.PutObjectRequest,
                callback: (err, data: aws.S3.ManagedUpload.SendData) => unknown,
              ) => {
                callback(
                  {
                    err: 'err_message',
                  },
                  null,
                );
              },
            );

            return aws;
          },
        },
        PhotosService,
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('When creating a photo and upload to S3 fails, it should throw an exception', async () => {
    await expect(async () => {
      return await service.create({
        description: 'hello',
        file: {
          size: 1,
          mimetype: 'image/png',
        } as any,
      });
    }).rejects.toThrow(err_messages.s3_upload_error);
  });

  it('When creating a photo and upload to S3 fails, it should not exist in database', async () => {
    const dbPhotosCountStart = await service.count();

    await expect(async () => {
      return await service.create({
        description: 'hello',
        file: {
          size: 1,
          mimetype: 'image/png',
        } as any,
      });
    }).rejects.toThrow(err_messages.s3_upload_error);

    const dbPhotosCountEnd = await service.count();

    expect(dbPhotosCountEnd).toEqual(dbPhotosCountStart);
  });
});

describe('PhotosServiceWithFailingPhotoRepositoryCreateMethod', () => {
  let service: PhotosService;

  beforeEach(async () => {
    s3Storage = {};

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: `PhotoRepository`,
          useValue: {
            create: (...args) => {
              throw new NotImplementedException();
            },
          },
        },
        {
          provide: `aws`,
          useFactory: async () => {
            AWSMock.restore('S3');
            AWSMock.setSDKInstance(aws);

            // mock S3.upload method
            AWSMock.mock(
              'S3',
              'upload',
              (
                params: aws.S3.PutObjectRequest,
                callback: (err, data: aws.S3.ManagedUpload.SendData) => unknown,
              ) => {
                s3Storage[params.Key] = true;

                callback(null, {
                  Location: 'some-location',
                  ETag: 'd41d8cd98f00b204e9800991ecf8427e',
                  Key: params.Key,
                  Bucket: params.Bucket,
                });
              },
            );

            return aws;
          },
        },
        PhotosService,
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('when photo insertion in db fails, it should not exist s3', async () => {
    const s3ObjectsCount = Object.keys(s3Storage).length;

    await expect(async () => {
      return await service.create({
        description: 'hello',
        file: {
          size: 1,
          mimetype: 'image/png',
        } as any,
      });
    }).rejects.toThrow();

    expect(s3ObjectsCount).toEqual(Object.keys(s3Storage).length);
  });
});
