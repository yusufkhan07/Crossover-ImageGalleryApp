import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as aws from 'aws-sdk';

import { PhotosController } from './photos.controller';
import { PhotoCreatorService } from './photo-creator.service';
import { PhotoSearchService } from './photo-search.service';
import { Photo } from './models/photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Photo]), ConfigModule],
  controllers: [PhotosController],
  providers: [
    PhotoCreatorService,
    PhotoSearchService,
    {
      provide: `aws`,
      useFactory: async () => {
        return aws;
      },
    },
  ],
})
export class PhotosModule {}
