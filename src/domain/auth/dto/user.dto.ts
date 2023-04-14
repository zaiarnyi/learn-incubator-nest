import { UserRoles } from '../enums/roles.enum';

export class UserDto {
  id: string;
  device: string;
  role: UserRoles;
}
