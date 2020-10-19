import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as aws from 'aws-sdk';

import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './models/photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Photo]), ConfigModule],
  controllers: [PhotosController],
  providers: [
    PhotosService,
    {
      provide: `aws`,
      useFactory: async () => {
        return aws;
      },
    },
  ],
})
export class PhotosModule {}
