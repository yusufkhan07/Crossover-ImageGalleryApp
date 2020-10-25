import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotImplementedException } from '@nestjs/common';
import * as AWSMock from 'aws-sdk-mock';
import * as aws from 'aws-sdk';

import { PhotoCreatorService, err_messages } from './photo-creator.service';
import { Photo } from './models/photo.model';

jest.mock('./models/photo.model');

let s3Storage: {};

beforeEach(async () => {
  jest.resetAllMocks();
});

describe('PhotoCreatorService', () => {
  let service: PhotoCreatorService;
  let module: TestingModule;

  beforeEach(async () => {
    s3Storage = {};

    module = await Test.createTestingModule({
      providers: [
        {
          provide: `PhotoRepository`,
          useValue: Photo,
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
        ConfigService,
        PhotoCreatorService,
      ],
    }).compile();

    service = module.get(PhotoCreatorService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('When creating a photo and file type is valid, it should have size less than or equal to 500kb', async () => {
    await service.create({
      description: 'hello',
      file: {
        originalname: 'some-file-name',
        buffer: [],
        size: 250 * 1024,
        mimetype: 'image/png',
      },
    });

    expect(Photo.create).toBeCalledWith(
      expect.objectContaining({
        description: 'hello',
        size: 250 * 1024,
        mimetype: 'image/png',
      }),
    );
  });

  it('When creating a photo and file type is valid and file size is greater han 500kb, it should throw a BadRqeuestException', async () => {
    await expect(async () => {
      await service.create({
        description: 'hello',
        file: {
          originalname: 'some-file-name',
          buffer: [],
          size: 501 * 1024,
          mimetype: 'image/png',
        },
      });
    }).rejects.toThrow(err_messages.invalid_file_size);
  });

  it('When creating a photo and file size is valid, it should have a type of png or jpeg', async () => {
    await service.create({
      description: 'hello',
      file: {
        originalname: 'some-file-name',
        buffer: [],
        size: 1,
        mimetype: 'image/png',
      },
    });

    expect(Photo.create).toBeCalledWith(
      expect.objectContaining({
        description: 'hello',
        size: 1,
        mimetype: 'image/png',
      }),
    );

    await service.create({
      description: 'hello',
      file: {
        originalname: 'some-file-name',
        buffer: [],
        size: 2,
        mimetype: 'image/jpeg',
      },
    });

    expect(Photo.create).toBeCalledWith(
      expect.objectContaining({
        description: 'hello',
        size: 2,
        mimetype: 'image/jpeg',
      }),
    );
  });

  it('When creating a photo and file size is valid but file type is not png or jpeg, it should throw an exception', async () => {
    await expect(async () => {
      await service.create({
        description: 'hello',
        file: {
          originalname: 'some-file-name',
          buffer: [],
          size: 1,
          mimetype: 'image/gif',
        },
      });
    }).rejects.toThrow(err_messages.invalid_file_type);
  });

  it('When creating a photo is succesfull, it should exist in db & s3', async () => {
    const s3ObjectsCount = Object.keys(s3Storage).length;

    await service.create({
      description: 'hello',
      file: {
        originalname: 'some-file-name',
        buffer: [],
        size: 0,
        mimetype: 'image/png',
      },
    });

    // photo was created
    expect(Photo.create).toBeCalledWith(
      expect.objectContaining({
        description: 'hello',
        size: 0,
        mimetype: 'image/png',
      }),
    );

    expect(Object.keys(s3Storage).length).toEqual(s3ObjectsCount + 1);
  });
});

describe('PhotosServiceWithFailingS3', () => {
  let service: PhotoCreatorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: `PhotoRepository`,
          useValue: Photo,
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
        PhotoCreatorService,
        ConfigService,
      ],
    }).compile();

    service = module.get<PhotoCreatorService>(PhotoCreatorService);
  });

  it('When creating a photo and upload to S3 fails, it should throw an exception', async () => {
    await expect(async () => {
      return await service.create({
        description: 'hello',
        file: {
          originalname: 'some-file-name',
          buffer: [],
          size: 1,
          mimetype: 'image/png',
        },
      });
    }).rejects.toThrow(err_messages.s3_upload_error);
  });

  it('When creating a photo and upload to S3 fails, it should not exist in database', async () => {
    await expect(async () => {
      return await service.create({
        description: 'hello',
        file: {
          originalname: 'some-file-name',
          buffer: [],
          size: 1,
          mimetype: 'image/png',
        },
      });
    }).rejects.toThrow(err_messages.s3_upload_error);

    expect(Photo.destroy).toBeCalled();
  });
});

describe('PhotoCreatorServiceWithFailingPhotoRepositoryCreateMethod', () => {
  let service: PhotoCreatorService;

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
        ConfigService,
        PhotoCreatorService,
      ],
    }).compile();

    service = module.get<PhotoCreatorService>(PhotoCreatorService);
  });

  it('when photo insertion in db fails, it should not exist s3', async () => {
    const s3ObjectsCount = Object.keys(s3Storage).length;

    await expect(async () => {
      return await service.create({
        description: 'hello',
        file: {
          originalname: 'some-file-name',
          buffer: [],
          size: 1,
          mimetype: 'image/png',
        },
      });
    }).rejects.toThrow();

    expect(s3ObjectsCount).toEqual(Object.keys(s3Storage).length);
  });
});
