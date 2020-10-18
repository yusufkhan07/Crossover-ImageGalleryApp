import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Photo } from './models/photo.model';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo)
    private photoModel: typeof Photo,
  ) {}

  private async uploadToS3(file) {
    throw new NotImplementedException();
  }

  // inserts record in RDS and upload image to s3.
  async create(photo): Promise<Photo> {
    const created = await this.photoModel.create(photo);

    await this.uploadToS3(photo);

    return created;
  }
}
