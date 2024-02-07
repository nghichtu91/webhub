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
import {
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GiftcodeCreateDto } from '../dtos/giftcodeCreate.dto';
import { GiftcodeUpdateDto } from '../dtos/giftcodeUpdate.dto';
import { GiftcodeService } from '../services/giftcode.service';
import { GiftcodelogService } from '../services/giftcodelog.service';
import { AppPermissionBuilder, JwtAuth, ReqUser, User } from '@shared';
import { UserService } from '@modules/user/services';
import { GiftcodelogCreateDto } from '../dtos/giftcodelogCreate.dto';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResources } from '@config';
import { GiftcodeEntity } from '../entities/giftcode.entity';

interface IPageReponse<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}


@Controller('giftcodes')
@Injectable()
@ApiTags('giftcodes')
export class GiftcodeControler {
  constructor(
    private readonly giftcodeService: GiftcodeService,
    private readonly giftcodelogService: GiftcodelogService,
    private readonly userService: UserService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}


  private pemission(currentUser: ReqUser) {
    return new AppPermissionBuilder()
      .setRolesBuilder(this.rolesBuilder)
      .setRequestUser(currentUser)
      .setAction('read')
      .setAction('create')
      .setAction('update')
      .setAction('delete')
      .setResourceName(AppResources.ADMIN)
      .setCreatorId(currentUser.id)
      .build()
      .grant();
  }

  @JwtAuth()
  @Get()
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'form', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'paged', description: 'Page cần xem' })
  @ApiQuery({ name: 'limit', description: 'Số items trong 1 page' })
  async getGiftcode(
    @Query('paged') paged: number = 1,
    @Query('limit') limit: number = 12,
    @Query('keyword') keyword: string,
    @Query('to') to: string,
    @Query('form') form: string,
    @User() currentUser: ReqUser,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }

    const t = await this.giftcodeService.list(paged, limit, keyword);
    const total = await this.giftcodeService.total({ keyword });

    const vv: IPageReponse<GiftcodeEntity> = {
      pageNum: paged,
      pageSize: limit,
      total: total,
      data: t,
    };
    return vv;
  }

  @JwtAuth()
  @Post()
  @ApiOperation({
    summary: 'Tạo gift code',
  })
  @ApiBody({ type: GiftcodeCreateDto })
  async createGiftcode(@User() currentUser: ReqUser, @Body() giftcodeCreateDto: GiftcodeCreateDto) {

    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }

    try {
      
      await this.giftcodeService.createRandom(giftcodeCreateDto);

      return new HttpException(
        `Tạo Giftcode thành công.`,
        HttpStatus.CREATED,
      );
    } catch (e) {
      throw new HttpException(
        `Có lỗi trong quá trình tạo giftcode`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @JwtAuth()
  @Patch(':id')
  @ApiParam({
    name: 'id',
  })
  @ApiOperation({
    summary: 'Update gift code',
  })
  async updateGiftcode(
    @User() currentUser: ReqUser,
    @Param('id') id: number,
    @Body() giftcodeUpdate: GiftcodeUpdateDto,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
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

  @JwtAuth()
  @ApiOperation({
    summary: 'Delete gift code',
  })
  @Delete(':id')
  async deleteGiftcode(@User() currentUser: ReqUser, @Param('id') id: number) {

    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }

    try {
      await this.giftcodeService.delete(id);
      return new HttpException(`Xóa giftcode thành công.`, HttpStatus.OK);
    } catch (e) {
      throw new HttpException(
        `Có lỗi trong quá trình xóa giftcode`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @JwtAuth()
  @Post('using')
  async useGiftcode(@User() currentUser: ReqUser, @Query('code') code: string) {
    try {
      const findCode = await this.giftcodeService.getByCode(
        code,
      );

      if(!findCode) {
        throw new HttpException(
          `Giftcode ${code} không tồn tại.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const cat = findCode.category;

      const checklog = await this.giftcodelogService.check(code, currentUser.username);

      if(checklog) {
        throw new HttpException(
          `Giftcode đã sử dụng.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const checkGiftcodeCat = await this.giftcodelogService.checkCat(currentUser.username, cat);

      if(checkGiftcodeCat) {
        throw new HttpException(
          `Tài khoản đã sử dụng giftcode thuộc loại này rồi.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const giftcodeEntity = await this.giftcodeService.getByCode(code);

      if(!giftcodeEntity.isUse()) {
        throw new HttpException(
          `Giftcode ${code} hết hạn sử dụng.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      
      await this.userService.addGiftcodePoint(currentUser.username, giftcodeEntity.value);
      const giftcodelog = new GiftcodelogCreateDto(giftcodeEntity, currentUser.username, cat);
      await this.giftcodelogService.create(giftcodelog);

      if(giftcodeEntity.times > 0 ) {
        await this.giftcodeService.updateTimes(giftcodeEntity.id);
      }
      return new HttpException('Sử dụng giftcode thành công!', HttpStatus.ACCEPTED);

    } catch (e) {
      const error = e as HttpException;
      throw new HttpException(
        error?.message || 'Có lỗi từ hệ thống', error.getStatus() || HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
  //#region  logs
  @JwtAuth()
  @Get('logs')
  @ApiQuery({ name: 'paged', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  giftcodelogs(
    @User() currentUser: ReqUser,
    @Query('paged') paged: number = 1,
    @Query('limit') limit: number = 12,
    @Query('keyword') keyword: string,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
    return this.giftcodelogService.list(paged, limit, keyword);
  }
  //#endregion
}
