import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  ValidationPipe,
  BadRequestException,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsString, IsNotEmpty } from 'class-validator';

import { PhotoCreatorService } from './photo-creator.service';
import { PhotoSearchService } from './photo-search.service';
import { PhotoDto } from './dto/photo.dto';
import { ApiQuery } from '@nestjs/swagger';

class PostPostDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}

@Controller('photos')
export class PhotosController {
  constructor(
    private readonly photosService: PhotoCreatorService,
    private readonly photoSearchService: PhotoSearchService,
  ) {}

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

  @ApiQuery({
    name: 'description',
    required: false,
  })
  @ApiQuery({
    name: 'mimetype',
    required: false,
  })
  @ApiQuery({
    name: 'curPage',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  @ApiQuery({
    name: 'size',
    required: false,
  })
  @Get('')
  list(
    @Query('curPage', ParseIntPipe) curPage: number = 0,
    @Query('limit', ParseIntPipe) limit: number = 20,
    @Query('description') description?: string,
    @Query('mimetype') mimetype?: string,
    @Query('size') size?: number,
  ) {
    if (description) {
      return this.photoSearchService.searchByDescription(
        description,
        curPage,
        limit,
      );
    }
    if (mimetype) {
      return this.photoSearchService.searchByMimetype(mimetype, curPage, limit);
    }
    if (size) {
      return this.photoSearchService.searchBySize(size, curPage, limit);
    }
    return this.photoSearchService.list(curPage, limit);
  }
}
