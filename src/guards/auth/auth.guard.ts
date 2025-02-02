import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>
  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    // console.log("Request Body in Guard",request.body)
    // console.log("Request Path in Guard",request.path)
    if (!token) {
      throw new UnauthorizedException('Error from AuthGuard');
    }
    try {
      const payload = await jwt.verify( token, process.env.JWT_SECRET);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers 
      console.log()
      request['user'] = payload;
    } 
    catch {
      throw new UnauthorizedException('Error from AuthGuard 2');
    }
    return true;
  }
}
