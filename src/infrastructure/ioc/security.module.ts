import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoCollections } from '../database/mongo.collections';
import { Security, SecuritySchema } from '../../domain/security/entity/security.entity';
import { MainSecurityRepository } from '../database/repositories/security/main-security.repository';
import { QuerySecurityRepository } from '../database/repositories/security/query-security.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../configs/jwt/jwt.config';
import { SecurityController } from '../../presentation/controllers/security.controller';
import { GetDevicesAction } from '../../application/actions/security/get-devices.action';
import { DeleteDevicesAction } from '../../application/actions/security/delete-devices.action';
import { DeleteCurrentDeviceAction } from '../../application/actions/security/delete-current-device.action';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Security.name,
        schema: SecuritySchema,
        collection: MongoCollections.SECURITY,
      },
    ]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [SecurityController],
  providers: [
    MainSecurityRepository,
    QuerySecurityRepository,
    GetDevicesAction,
    DeleteDevicesAction,
    DeleteCurrentDeviceAction,
  ],
  exports: [MainSecurityRepository],
})
export class SecurityModule {}
