import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import { Inject } from '@nestjs/common';

export class MongoConfigDatabase implements MongooseOptionsFactory {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const connectionName = this.configService.get<string>('MONGO_DB_NAME');
    const uri = this.configService.get<string>('MONGO_DB_URL') + connectionName;
    return { uri, retryAttempts: 3 };
  }
}
