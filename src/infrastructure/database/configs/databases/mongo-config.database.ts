import { ConfigService } from '@nestjs/config';

export class MongoConfigDatabase {
  static connectionDB(configService: ConfigService): { uri: string } {
    const uri =
      configService.get<string>('MONGO_DB_URL') +
      configService.get<string>('MONGO_DB_NAME');
    return { uri };
  }
}
