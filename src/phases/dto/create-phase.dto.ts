import { IsNotEmpty, IsString } from "class-validator";

export class CreatePhaseDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
