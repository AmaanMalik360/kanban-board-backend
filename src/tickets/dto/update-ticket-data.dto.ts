
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateTicketDataDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;
    
    // @IsString()
    // completed: string;

}
