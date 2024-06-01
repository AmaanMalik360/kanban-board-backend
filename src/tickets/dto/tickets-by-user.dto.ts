
import { IsArray, IsNotEmpty } from "class-validator";

export class TicketsByUsersDto {
    @IsArray()
    @IsNotEmpty()
    users: number[];

}
