import { Column, Model, Table, PrimaryKey } from 'sequelize-typescript';

@Table
export class Photo extends Model<Photo> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  description: string;

  @Column
  s3Key: string;
}
