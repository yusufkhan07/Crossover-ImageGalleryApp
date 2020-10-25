import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Photo } from './models/photo.model';
import { PhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoSearchService {
  constructor(
    @InjectModel(Photo)
    private readonly photoModel: typeof Photo,
  ) {}

  async list(curPage: number, limit: number): Promise<PhotoDto[]> {
    return this.photoModel.findAll({
      limit,
      offset: curPage * limit,
    });
  }

  async searchByDescription(
    description: string,
    curPage: number,
    limit: number,
  ): Promise<PhotoDto[]> {
    return this.photoModel.findAll({
      where: {
        description: {
          [Op.iLike]: description,
        },
      },
      limit,
      offset: curPage * limit,
    });
  }
}
