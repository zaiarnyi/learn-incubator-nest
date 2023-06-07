import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import * as sharp from 'sharp';

export type ImageSizeValidatorType = {
  width: number;
  height: number;
};

export class ImageSizeValidator extends FileValidator<ImageSizeValidatorType> {
  async isValid(file?: any): Promise<boolean> {
    const metadata = await sharp(file.buffer).metadata();
    if (!/(png|jpg|jpeg)/.test(metadata.format)) {
      return false;
    }

    if (metadata.width !== this.validationOptions.width) {
      return false;
    }

    return metadata.height === this.validationOptions.height;
  }

  buildErrorMessage(file: any): string {
    return 'size is not valid';
  }
}
