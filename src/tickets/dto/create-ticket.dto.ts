
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsNotEmpty()
    user_id: number;
    
    @IsNotEmpty()
    phase_id: number;

}
