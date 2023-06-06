import { Module } from '@nestjs/common';
import { ImageService } from '../external/modules/images/image.service';

@Module({
  imports: [],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImagesModule {}
