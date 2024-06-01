import { IsEmail, IsNotEmpty } from "class-validator";

export class ConfigurePasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
