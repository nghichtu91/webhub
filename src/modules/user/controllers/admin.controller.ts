import {
  Controller,
  Get,
  Param,
  Patch,
  HttpStatus,
  Body,
  HttpException,
  Logger,
  Query,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth, User, ReqUser, AppPermissionBuilder } from '@shared';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IUpdateUserDTO } from '../dtos';
import { AppResources } from '@config';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { PaymentService } from '@modules/payment/services';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
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
  @ApiOperation({ summary: 'Danh sách tài khoản' })
  @ApiOkResponse({
    description: 'Lấy danh sách tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server errors',
  })
  @ApiQuery({ name: 'paged', description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', description: 'Số item trong 1 trang' })
  @Get('users')
  async getUsers(
    @User() currentUser: ReqUser,
    @Query('paged') paged: number,
    @Query('limit') limit = 12,
    @Query('keyword') keyword: string,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
    const count = await this.userService.getCount(keyword);
    const data = await this.userService.getUsers(paged, limit, keyword);

    return {
      pageNum: paged,
      total: count,
      pageSize: limit,
      data: data,
    };
  }

  @JwtAuth()
  @ApiOperation({ summary: 'Danh sách tài khoản' })
  @ApiOkResponse({
    description: 'Lấy danh sách tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server errors',
  })
  @ApiQuery({ name: 'paged', description: 'Trang hiện tại' })
  @ApiQuery({ name: 'limit', description: 'Số item trong 1 trang' })
  @Get('statistic/:action')
  async statistic(
    @User() currentUser: ReqUser,
    @Param('action') action: string,
    @Query('year') year?: number,
    @Query('form') form?: string,
    @Query('to') to?: string,
  ) {
    if (!this.pemission(currentUser).granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }
    switch (action) {
      case 'paymentbyyear':
        return this.paymentService.staticByYear(year);
      case 'paymentformto':
        return this.paymentService.staticByFormTo(form, to);
      case 'totals':
        return {
          accounts: await this.userService.getCount(''),
          payments: await this.paymentService.count(),
          money: await this.paymentService.sumMomey(),
          moneyToday: await this.paymentService.sumMoneyToday(),
        };
      default:
        throw new HttpException(``, HttpStatus.NOT_FOUND);
    }
  }

  @JwtAuth()
  @ApiOperation({ summary: 'Thông tin tài khoản' })
  @Get('users/:id')
  @ApiParam({ name: 'id', description: 'tài khoản cần xem thông tin' })
  getUser() {
    return true;
  }

  @JwtAuth()
  @ApiOkResponse({
    description: 'Cập nhật tài khoản thành công',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Không có quyền truy cập',
  })
  @ApiOperation({ summary: 'Cập nhật thông tin tài khoản' })
  @Patch('users/:id/:action')
  @ApiParam({ name: 'id', description: 'tài khoản cần chỉnh sửa' })
  async updateUser(
    @Body() body: IUpdateUserDTO,
    @Param('id') username: string,
    @Param('action') action: string,
    @User() userCurrent: ReqUser,
  ) {
    if (!this.pemission(userCurrent).granted) {
      throw new HttpException(`Không có quyền truy cập.`, HttpStatus.FORBIDDEN);
    }
    try {
      const user = await this.userService.getUser(username);
      if (!user) {
        throw new HttpException(
          `Tài khoản ${username} không tồn tại.`,
          HttpStatus.NOT_FOUND,
        );
      }
      switch (action) {
        case 'addxu':
          await this.userService.addMoney(username, body.point);
          this.logger.log(
            `admin ${userCurrent.username} thêm vào tài khoản ${username} ${body.point} xu.`,
          );
          break;
        default:
          break;
      }
    } catch (e: unknown) {
      const error = e as Error;
      this.logger.error(error.message);
      throw new HttpException(
        `Có lỗi từ hệ thống`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
