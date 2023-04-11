import { Controller, Delete, Get, HttpCode, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { GetDevicesResponse } from '../responses/security/get-devices.response';
import { GetDevicesAction } from '../../application/actions/security/get-devices.action';
import { DeleteDevicesAction } from '../../application/actions/security/delete-devices.action';
import { DeleteCurrentDeviceAction } from '../../application/actions/security/delete-current-device.action';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';

@SkipThrottle()
@Controller('security')
export class SecurityController {
  constructor(
    @Inject(GetDevicesAction) private readonly getDevicesAction: GetDevicesAction,
    @Inject(DeleteDevicesAction) private readonly deleteSessionAction: DeleteDevicesAction,
    @Inject(DeleteCurrentDeviceAction) private readonly deleteCurrentDeviceAction: DeleteCurrentDeviceAction,
  ) {}
  @UseGuards(JwtAuthOptionalGuard)
  @Get('devices')
  async getDevicesByUser(@Req() req: any): Promise<GetDevicesResponse[]> {
    return this.getDevicesAction.execute(req?.user?.userId);
  }

  @Delete('devices')
  @UseGuards(JwtAuthOptionalGuard)
  @HttpCode(204)
  async deleteDevicesCurrentUser(@Req() req: any) {
    return this.deleteSessionAction.execute(req?.user?.deviceId, req?.user?.userId);
  }

  @Delete('/devices/:id')
  @UseGuards(JwtAuthOptionalGuard)
  @HttpCode(204)
  async deleteCurrentDevice(@Req() req: any, @Param('id') id: string) {
    return this.deleteCurrentDeviceAction.execute(id, req?.user);
  }
}
