import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString, IsNotEmpty } from 'class-validator';

import { PhotosService } from './photos.service';
import { PhotoDto } from './dto/photo.dto';

class PostPostDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @UploadedFile() file,
    @Body(ValidationPipe) dto: PostPostDto,
  ): Promise<PhotoDto> {
    if (!file) {
      throw new BadRequestException(`file is required`);
    }

    return this.photosService.create({
      file,
      description: dto.description,
    } as any);
  }
}
