import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const token = request?.cookies?.token;
          console.log('Extracting JWT - cookies:', request?.cookies);
          console.log('Extracted token:', token ? 'Token found' : 'No token');
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy validate - payload:', payload);
    
    if (!payload.userId) {
      console.log('No userId in payload');
      throw new UnauthorizedException('Invalid token payload');
    }
    
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      console.log('User not found for userId:', payload.userId);
      throw new UnauthorizedException('Not authorized. Try login again.');
    }
    
    console.log('User validated:', user.id);
    return { userId: user.id };
  }
}