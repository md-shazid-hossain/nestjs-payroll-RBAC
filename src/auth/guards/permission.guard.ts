import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '../decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userPermissions =
      user.roles?.flatMap(
        (role) =>
          role.permissions?.map((p) => `${p.action}:${p.subject}`) ?? [],
      ) ?? [];

    // console.log(userPermissions);
    // console.log('Required:', requiredPermissions);
    // console.log('User permissions:', userPermissions);
    return requiredPermissions.every((req) => userPermissions.includes(req));
  }
}
