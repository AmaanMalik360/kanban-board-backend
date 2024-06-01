import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class VerticalDragDto {
    @IsArray()
    @IsNotEmpty()
    currentPhaseTickets: object[];

}
