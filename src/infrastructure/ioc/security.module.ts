import { Module } from '@nestjs/common';
import { MainSecurityRepository } from '../database/repositories/security/main-security.repository';
import { QuerySecurityRepository } from '../database/repositories/security/query-security.repository';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../configs/jwt/jwt.config';
import { SecurityController } from '../../presentation/controllers/security.controller';
import { GetDevicesAction } from '../../application/actions/security/get-devices.action';
import { DeleteDevicesAction } from '../../application/actions/security/delete-devices.action';
import { DeleteCurrentDeviceAction } from '../../application/actions/security/delete-current-device.action';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityEntity } from '../../domain/security/entity/security.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    TypeOrmModule.forFeature([SecurityEntity]),
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
