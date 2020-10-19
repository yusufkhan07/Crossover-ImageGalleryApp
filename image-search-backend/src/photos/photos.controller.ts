import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString } from 'class-validator';

import { PhotosService } from './photos.service';
import { Photo } from './models/photo.model';
import { PhotoDto } from './dto/photo.dto';

class PostPostDto {
  @IsString()
  description: string;
}

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @UploadedFile('photo') file,
    @Body() dto: PostPostDto,
  ): Promise<PhotoDto> {
    return this.photosService.create({} as any);
  }
}
