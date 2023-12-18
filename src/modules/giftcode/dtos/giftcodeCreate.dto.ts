import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

interface IGiftcodeCreateDto {
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
        nullable: true,
        type: Number
    })
    times?: number;

    @IsOptional()
    @ApiProperty({
        nullable: true
    })
    expired?: Date;
}