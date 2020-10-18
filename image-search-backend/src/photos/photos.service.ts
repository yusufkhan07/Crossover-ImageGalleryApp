import { Injectable, NotImplementedException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as aws from 'aws-sdk';

import { Photo } from './models/photo.model';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo)
    private readonly photoModel: typeof Photo,
    @Inject(`aws`)
    private readonly _aws: typeof aws,
  ) {}

  private async uploadToS3(file) {
    const s3 = new this._aws.S3();

    const upload = await s3
      .upload({
        Bucket: '',
        Key: 'a',
        Body: Buffer.from([]),
      })
      .promise();

    console.log('PhotosService -> upload', upload);

    throw new NotImplementedException();
  }

  // inserts record in RDS and upload image to s3.
  async create(photo): Promise<Photo> {
    await this.uploadToS3(photo);
    const created = await this.photoModel.create(photo);

    return created;
  }
}
