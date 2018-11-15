import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CustomAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(req) {
    if (!req.headers.authorization) {
      return false;
    }
    req.user = await this.validateToken(req.headers.authorization);

    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer')
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      return decoded;
    } catch (err) {
      const message = `Token error: ${(err.message || err.name)}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
