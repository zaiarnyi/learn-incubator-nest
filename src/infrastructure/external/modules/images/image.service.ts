import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  public async detectSize(buffer: Buffer): Promise<{ width: number; height: number; size: number }> {
    const metadata = await sharp(buffer).metadata();
    return { width: Number(metadata.width), height: Number(metadata.height), size: metadata.size };
  }

  public async toSize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return sharp(buffer).resize({ width, height }).toBuffer();
  }
}
