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

import { PhotoCreatorService } from './photo-creator.service';
import { PhotoDto } from './dto/photo.dto';

class PostPostDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotoCreatorService) {}

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
