import { Body, Controller, Delete, Get, Injectable, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags, ApiParam } from "@nestjs/swagger";
import { GiftcodeCreateDto } from "../dtos/giftcodeCreate.dto";
import { GiftcodeUpdateDto } from "../dtos/giftcodeUpdate.dto";

@Controller('giftcodes')
@Injectable()
@ApiTags('giftcodes')
export class GiftcodeControler {
    @Get()
    getGiftcode(
        @Query('paged') paged: number,
        @Query('limit') limit = 12,
        @Query('keyword') keyword: string,
        @Query('to') to: string,
        @Query('form') form: string,
    ) {
        
    }

    @Post()
    @ApiOperation({
        summary: 'Tạo gift code',
    })
    @ApiBody({ type: GiftcodeCreateDto })
    createGiftcode(@Body() giftcodeCreate: GiftcodeCreateDto) {}

    @Patch(':id')
    @ApiParam({
        name: 'id'
    })
    @ApiOperation({
        summary: 'Update gift code',
    })
    updateGiftcode(@Param('id') id: number, @Body() giftcodeUpdate: GiftcodeUpdateDto) {
        console.log(id)
    }

    @ApiOperation({
        summary: 'Delete gift code',
    })
    @Delete(':id')
    deleteGiftcode(@Param('id') id: number) {}

    //#region  logs
    //#endregion
}