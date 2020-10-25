import {
  Injectable,
  Inject,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import * as aws from 'aws-sdk';
const { v4: uuid } = require('uuid');

import { Photo } from './models/photo.model';
import { PhotoDto } from './dto/photo.dto';

export const err_messages = {
  invalid_file_size: `file size should be less than 500kb`,
  invalid_file_type: `file type should be jpeg or png`,
  s3_upload_error: `uplodaing to S3 failed`,
};

@Injectable()
export class PhotoCreatorService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Photo)
    private readonly photoModel: typeof Photo,
    @Inject(`aws`)
    private readonly _aws: typeof aws,
  ) {}

  private async uploadToS3(file: { Key: string; Body: aws.S3.Body }) {
    const s3 = new this._aws.S3();

    const upload = await s3
      .upload({
        Bucket: this.configService.get<string>('AWS_IMAGES_BUCKET'),
        Key: file.Key,
        Body: file.Body,
      })
      .promise();

    return upload;
  }

  private validate(photo) {
    if (photo.file.size / 1024 > 500) {
      throw new BadRequestException(err_messages.invalid_file_size);
    }

    if (
      photo.file.mimetype !== 'image/png' &&
      photo.file.mimetype !== 'image/jpeg'
    ) {
      throw new BadRequestException(err_messages.invalid_file_type);
    }
  }

  async create(photo: {
    file: {
      originalname: string;
      mimetype: string;
      buffer;
      size: number;
    };
    description: string;
  }): Promise<PhotoDto> {
    this.validate(photo);

    const s3Key: string = uuid();

    const created = await this.photoModel.create({
      description: photo.description,
      s3Key,
      size: photo.file.size,
      mimetype: photo.file.mimetype,
    });

    try {
      await this.uploadToS3({
        Key: s3Key,
        Body: photo.file.buffer,
      });
    } catch (err) {
      await this.photoModel.destroy({
        where: {
          s3Key,
        },
      });

      throw new UnprocessableEntityException(err_messages.s3_upload_error);
    }

    return created;
  }
}
