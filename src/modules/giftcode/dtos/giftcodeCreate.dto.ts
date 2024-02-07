import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEmpty } from "class-validator";

export interface IGiftcodeCreateDto {
    value: number;
    nums?: number;
    cat?: string;
}

export class GiftcodeCreateDto implements IGiftcodeCreateDto {

    @IsOptional()
    @ApiProperty() 
    value: number;

    @IsOptional()
    @ApiProperty() 
    cat: string;


    @IsOptional()
    @ApiProperty({
        type: Number
    })
    nums?: number;
}