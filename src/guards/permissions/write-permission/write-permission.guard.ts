import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { CheckPermissionService } from '../check-permission';

@Injectable()
export class WritePermissionGuard implements CanActivate {
  
  constructor(@Inject(CheckPermissionService) private checkPermissionService: CheckPermissionService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> 
  {
    const request = context.switchToHttp().getRequest();
    if (!request) {
      throw new HttpException('An Error Occurred', HttpStatus.BAD_REQUEST);
    }
    
    try {
      // Check if the 'user' object exists on the request and contains 'permissions' array
      if (!request.user || !request.user.permissions || !Array.isArray(request.user.permissions)) {
        throw new UnauthorizedException('Error In Request');
      }

      // console.log(request.user.permissions)

      const permissionInToken = request.user.permissions.includes('Write');
      if(!permissionInToken) 
        throw new UnauthorizedException('Not permitted to add movies');

      // Check if the user has the 'Write' permission
      const hasWritePermission = await this.checkPermissionService.hasPermission('Write', request.user.id);
      if (!hasWritePermission) {
        throw new UnauthorizedException('Not permitted to add movies');
      }
      
      return true;
    } 
    catch (error) {
      // Handle specific errors and throw the appropriate HttpException
      if (error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      } 
      else {
        // For any other unexpected error, throw a generic internal server error
        throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}



