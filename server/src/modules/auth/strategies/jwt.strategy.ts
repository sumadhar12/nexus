import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          let token = request?.cookies?.token;
          if (!token) {
            token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: any) {
    if (!payload.userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Not authorized. Try login again.');
    }

    return { userId: user.id };
  }
}
