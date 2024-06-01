import { IsNotEmpty, IsNumber } from "class-validator";

export class UserPermissionDto
{
    @IsNotEmpty()
    @IsNumber()
    userId: number;
    
    @IsNotEmpty()
    @IsNumber()
    permissionId: number;
}