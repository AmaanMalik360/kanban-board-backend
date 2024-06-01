import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class UpdateTicketDto {
    @IsNotEmpty()
    @IsNumber()
    ticketId:number;
    
    @IsNotEmpty()
    @IsNumber()
    phaseId:number;
}
