import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Photo } from './models/photo.model';

@Injectable()
export class PhotoSearchService {
  constructor(
    @InjectModel(Photo)
    private readonly photoModel: typeof Photo,
  ) {}

  async list() {
    return this.photoModel.findAll();
  }

  async searchByDescription(description: string) {
    return this.photoModel.findAll({
      where: {
        description: {
          [Op.iLike]: description,
        },
      },
    });
  }
}
