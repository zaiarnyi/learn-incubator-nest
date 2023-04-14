import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoles } from '../enums/roles.enum';

@Injectable()
export class BloggerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    return user?.role === UserRoles.BLOGGER;
  }
}
