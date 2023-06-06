import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  GetBucketAclCommand,
  GetObjectCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl, S3RequestPresigner } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      apiVersion: '2006-03-01',
    });
    this.createBucket();
  }

  private async createBucket(): Promise<void> {
    const bucket = this.configService.get('AWS_BUCKET');
    try {
      const command = new GetBucketAclCommand({
        Bucket: bucket,
      });
      await this.s3Client.send(command);
    } catch (err) {
      try {
        const creatBucketCommand = new CreateBucketCommand({
          Bucket: bucket,
        });
        const { Location } = await this.s3Client.send(creatBucketCommand);
        console.log(`Bucket created with location ${Location}`);
      } catch (err) {
        console.error(err, 'eeee');
      }
    }
  }

  public async uploadToS3(buffer: Buffer, path: string) {
    const uploadCommand = new PutObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: path,
      Body: buffer,
      ACL: 'public-read',
    });
    await this.s3Client.send(uploadCommand);
    return this.configService.getOrThrow('AWS_LINK') + path;
  }

  public async deleteObject(path: string) {
    const deleteObject = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: path,
    });
    await this.s3Client.send(deleteObject);
  }
}
