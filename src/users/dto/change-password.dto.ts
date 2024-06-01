import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    @IsString()
    token: string;
}
