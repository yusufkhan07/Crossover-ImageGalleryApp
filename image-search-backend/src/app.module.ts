import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhotosModule } from './photos/photos.module';
import { Photo } from './photos/models/photo.model';

@Module({
  imports: [
    PhotosModule,
    SequelizeModule.forRoot({
      database: 'some_db',
      dialect: 'sqlite',
      username: 'root',
      password: '',
      storage: ':memory:',
      // modelPaths: [__dirname + '/../../**/*.model{.ts,.js}'],
      // models: [Photo],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
