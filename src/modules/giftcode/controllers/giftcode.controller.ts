import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GiftcodeCreateDto } from '../dtos/giftcodeCreate.dto';
import { GiftcodeUpdateDto } from '../dtos/giftcodeUpdate.dto';
import { GiftcodeService } from '../services/giftcode.service';

@Controller('giftcodes')
@Injectable()
@ApiTags('giftcodes')
export class GiftcodeControler {
  constructor(private readonly giftcodeService: GiftcodeService) {}
  @Get()
  @ApiQuery({name: 'keyword', required: false})
  @ApiQuery({name: 'form', required: false})
  @ApiQuery({name: 'to', required: false})
  @ApiQuery({name: 'paged', description: 'Page cần xem',})
  @ApiQuery({name: 'limit', description: 'Số items trong 1 page'})

  getGiftcode(
    @Query('paged') paged: number = 1,
    @Query('limit') limit: number = 12,
    @Query('keyword') keyword: string,
    @Query('to') to: string,
    @Query('form') form: string,
  ) {

    return this.giftcodeService.list(paged, limit, keyword)
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo gift code',
  })
  @ApiBody({ type: GiftcodeCreateDto })
  async createGiftcode(@Body() giftcodeCreate: GiftcodeCreateDto) {
    try {
      const findCode = await this.giftcodeService.findByCode(
        giftcodeCreate.code,
      );
      if (findCode) {
        return new HttpException(
          `Giftcode ${giftcodeCreate.code} đã tồn tại!`,
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.giftcodeService.create(giftcodeCreate);
      return new HttpException(
        `Giftcode ${giftcodeCreate.code} tạo thành công.`,
        HttpStatus.CREATED,
      );
    } catch (e) {
      throw new HttpException(
        `Có lỗi trong quá trình tạo giftcode`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
  })
  @ApiOperation({
    summary: 'Update gift code',
  })
  async updateGiftcode(
    @Param('id') id: number,
    @Body() giftcodeUpdate: GiftcodeUpdateDto,
  ) {
    try {
      await this.giftcodeService.update(id, giftcodeUpdate);
      return new HttpException(
        `Cập nhật giftcode thành công`,
        HttpStatus.ACCEPTED,
      );
    } catch (e) {
      throw new HttpException(
        `Có lỗi trong quá trình cập nhật giftcode`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @ApiOperation({
    summary: 'Delete gift code',
  })
  @Delete(':id')
  async deleteGiftcode(@Param('id') id: number) {
    try {
      await this.giftcodeService.delete(id);
      return new HttpException(`Xóa giftcode thành công.`, HttpStatus.OK)
    } catch (e) {
      throw new HttpException(
        `Có lỗi trong quá trình xóa giftcode`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  //#region  logs
  //#endregion
}
