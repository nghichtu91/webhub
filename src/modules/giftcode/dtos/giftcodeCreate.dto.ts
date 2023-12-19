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
        nullable: true,
        type: Number
    })
    times?: number;

    @IsOptional()
    @IsEmpty()
    @ApiProperty({
        type: Date, 
        nullable: true,
        required: false,
        
    })
    expired?: Date;
}