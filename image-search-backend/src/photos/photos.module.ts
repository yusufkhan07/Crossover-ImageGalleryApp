import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './models/photo.model';

@Module({
  imports: [SequelizeModule.forFeature([Photo])],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
