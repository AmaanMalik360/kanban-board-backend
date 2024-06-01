import { IsBoolean, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    @IsBoolean()
    is_admin: boolean;
}
