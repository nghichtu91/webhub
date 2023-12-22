import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEmpty } from "class-validator";

export interface IGiftcodeCreateDto {
    code: string;
    value: number;
    times?: number;
    expired?: Date;
}

export class GiftcodeCreateDto implements IGiftcodeCreateDto {
    @IsOptional()
    @ApiProperty({
        
    })
    code: string;

    @IsOptional()
    @ApiProperty() 
    value: number;

    @IsOptional()
    @ApiProperty({
       
        type: Number
    })
    times?: number;

    @IsOptional()
    @ApiProperty({
        type: Date, 
        required: false,
    })
    expired?: Date;
}