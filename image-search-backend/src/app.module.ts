import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './photos/photos.module';
import { Photo } from './photos/models/photo.model';

@Module({
  imports: [
    PhotosModule,
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      database: 'some_db',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: 'test.sqlite',
      // modelPaths: [__dirname + '/../../**/*.model{.ts,.js}'],
      // models: [Photo],
      autoLoadModels: true,
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
