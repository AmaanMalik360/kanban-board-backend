import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class SignInUserDto {

    @IsString()
    email: string;
    
    @IsString()
    password: string;
    
}
