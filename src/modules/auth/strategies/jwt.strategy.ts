import { PassportStrategy } from '@nestjs/passport';
import {Inject, Injectable} from '@nestjs/common';
import { jwtConstants } from './../constants/jwt.constant';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {AuthService} from "../services/auth.service";
import {UnauthorizedException} from "@nestjs/common/exceptions";
import {CoreLoggerService} from "../../common/services/logger/base-logger.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      @Inject(AuthService) private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  private logger = new CoreLoggerService(JwtStrategy.name)
  async validate(payload: { userId: number }) {
    this.logger.debug("payload:", payload)
    const userId = payload?.userId;
    const user = await this.authService.findById(userId);
    this.logger.debug("user:", user)
    if (!user) throw new UnauthorizedException();
    // const roleIds = user.userRoles.map(item => item.roleId);
    // const permissions = [];
    // if (roleIds.length > 0) {
    //   const userPermission = await this.authService.getPermissionByRoleIds(roleIds);
    //   userPermission.forEach((item) => {
    //     if (!permissions.includes(item.permissions.name)) {
    //       permissions.push(item.permissions.name);
    //     }
    //   })
    // }
    return {
      userId,
      userName: user.userName,
      // permissions,
    };
  }
}
