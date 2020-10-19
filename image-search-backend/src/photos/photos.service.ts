import {
  Injectable,
  Inject,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as aws from 'aws-sdk';
const { v4: uuid } = require('uuid');

import { Photo } from './models/photo.model';

export const err_messages = {
  invalid_file_size: `file size should be less than 500kb`,
  invalid_file_type: `file type should be jpeg or png`,
  s3_upload_error: `uplodaing to S3 failed`,
};

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(Photo)
    private readonly photoModel: typeof Photo,
    @Inject(`aws`)
    private readonly _aws: typeof aws,
  ) {}

  async count() {
    return this.photoModel.count();
  }

  private async uploadToS3(file) {
    const s3 = new this._aws.S3();

    const upload = await s3
      .upload({
        Bucket: '',
        Key: file.Key,
        Body: Buffer.from([]),
      })
      .promise();

    return upload;
  }

  // inserts record in RDS and upload image to s3.
  async create(photo: {
    file: {
      originalname: string;
      mimetype: string;
      buffer;
      size: number;
    };
    description: string;
  }): Promise<Photo> {
    if (photo.file.size / 1024 > 500) {
      throw new BadRequestException(err_messages.invalid_file_size);
    }

    if (
      photo.file.mimetype !== 'image/png' &&
      photo.file.mimetype !== 'image/jpeg'
    ) {
      throw new BadRequestException(err_messages.invalid_file_type);
    }

    const s3Key: string = uuid();

    const created = await this.photoModel.create({
      description: photo.description,
      s3Key,
    });

    try {
      await this.uploadToS3({
        Key: s3Key,
      });
    } catch (err) {
      await created.destroy();

      throw new UnprocessableEntityException(err_messages.s3_upload_error);
    }

    return created;
  }
}
