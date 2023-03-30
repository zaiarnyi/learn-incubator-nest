import { Controller, Delete, Get, HttpCode, Inject, Param } from '@nestjs/common';
import { Cookies } from '../../infrastructure/decorators/cookies.decorator';
import { GetDevicesResponse } from '../responses/security/get-devices.response';
import { GetDevicesAction } from '../../application/actions/security/get-devices.action';
import { DeleteDevicesAction } from '../../application/actions/security/delete-devices.action';
import { DeleteCurrentDeviceAction } from '../../application/actions/security/delete-current-device.action';

@Controller('security')
export class SecurityController {
  constructor(
    @Inject(GetDevicesAction) private readonly getDevicesAction: GetDevicesAction,
    @Inject(DeleteDevicesAction) private readonly deleteSessionAction: DeleteDevicesAction,
    @Inject(DeleteCurrentDeviceAction) private readonly deleteCurrentDeviceAction: DeleteCurrentDeviceAction,
  ) {}
  @Get('devices')
  async getDevicesByUser(@Cookies('refreshToken') token: string): Promise<GetDevicesResponse[]> {
    return this.getDevicesAction.execute(token);
  }

  @Delete('devices')
  @HttpCode(204)
  async deleteDevicesCurrentUser(@Cookies('refreshToken') token: string) {
    return this.deleteSessionAction.execute(token);
  }

  @Delete('/devices/:id')
  @HttpCode(204)
  async deleteCurrentDevice(@Cookies('refreshToken') token: string, @Param('id') id: string) {
    return this.deleteCurrentDeviceAction.execute(token, id);
  }
}
