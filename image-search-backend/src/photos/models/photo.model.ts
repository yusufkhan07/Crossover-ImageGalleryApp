import {
  Column,
  Model,
  Table,
  PrimaryKey,
  UpdatedAt,
  CreatedAt,
  AllowNull,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'photos',
  modelName: 'photos',
})
export class Photo extends Model<Photo> {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @AllowNull(false)
  @Column
  description: string;

  @AllowNull(false)
  @Column
  s3Key: string;

  @AllowNull(false)
  @Column
  size: number

  @AllowNull(false)
  @Column
  mimetype: string
}
