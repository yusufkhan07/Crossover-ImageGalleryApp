import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { PhotosModule } from '../src/photos/photos.module';
import { PhotoCreatorService } from '../src/photos/photo-creator.service';
import { PhotoDto } from '../src/photos/dto/photo.dto';
import assert = require('assert');

describe('PhotosController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PhotosModule],
    })
      .overrideProvider(PhotoCreatorService)
      .useValue({
        create: () => {
          return new PhotoDto();
        },
      })
      .overrideProvider(`PhotoRepository`)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/photos/ (POST) should return 201 status when photo is created', () => {
    return request(app.getHttpServer())
      .post('/photos/')
      .attach('photo', 'test/sample.png')
      .field('description', 'hello')
      .expect(201);
  });

  it('/photos/ (POST) should throw 400 when file is missing', () => {
    return request(app.getHttpServer())
      .post('/photos/')
      .field('description', 'hello')
      .expect(400);
  });

  it('/photos/ (POST) should throw 400 when description is missing', () => {
    return request(app.getHttpServer())
      .post('/photos/')
      .attach('photo', 'test/sample.png')
      .expect(400);
  });
});
