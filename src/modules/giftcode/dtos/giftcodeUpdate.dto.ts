import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export interface IGiftcodeUpdateDto {
    value: number;
    times?: number;
    expired?: Date;
}

export class GiftcodeUpdateDto implements IGiftcodeUpdateDto {
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