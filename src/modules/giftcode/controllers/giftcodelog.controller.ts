import { Controller, Get, Logger, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { GiftcodelogService } from "../services/giftcodelog.service";

@Controller("giftcodelogs")
@ApiTags('giftcodelogs')
export class GiftcodelogController {

    private readonly logger = new Logger(GiftcodelogController.name);
    constructor(private readonly giftcodelogService: GiftcodelogService) {}

    @Get()
    @ApiQuery({name: 'paged', required: false })
    @ApiQuery({name: 'limit', required: false })
    @ApiQuery({name: 'keyword', required: false })
    giftcodelogs(@Query('paged') paged: number = 1,
    @Query('limit') limit: number = 12,
    @Query('keyword') keyword: string) {
        return this.giftcodelogService.list(paged, limit, keyword);
    }
}