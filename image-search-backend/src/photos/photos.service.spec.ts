import { Test, TestingModule } from '@nestjs/testing';
import { PhotosService } from './photos.service';

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotosService],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload to S3 after RDS op', () => {
    fail();
  });

  it(`should upload photo to S3 when RDS op is successfull`, () => {
    fail();
  });

  it(`should not upload photo to S3 when RDS op fails`, () => {
    fail();
  });

  it(`should rollback RDS op when S3 upload fails`, () => {
    fail();
  });
});
