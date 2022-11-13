import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  HttpStatus,
  Body,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth, User, ReqUser } from '@shared';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UpdateUserDTO,
  ChangePassWordDTO,
  IUserModel,
  UserModel,
} from '../dtos';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @JwtAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản' })
  @ApiOkResponse({
    description: 'Lấy thành công thông tin tài khoản.',
    type: UserModel,
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền truy cập.',
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy tài khoản này.',
  })
  async getUserById(@Param('id') userId: string): Promise<IUserModel> {
    const user = await this.userService.getUser(userId);
    return user;
  }

  @JwtAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình cập nhật!',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa xác thực',
  })
  @ApiOkResponse({ description: 'Cập nhật thành công.' })
  @ApiParam({ name: 'id' })
  async updateUser(
    @Param('id') username: string,
    @Body() data: UpdateUserDTO,
    @User() currentUser: ReqUser,
  ) {
    // kiểm tra tài khoản cần cập nhật
    if (username !== currentUser.username) {
      throw new HttpException(``, HttpStatus.UNAUTHORIZED);
    }
    await this.userService.update(username, data);
    return {
      messages: `Cập nhật thành công!`,
    };
  }

  @JwtAuth()
  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Thay đổi mật khẩu' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình cập nhật!',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async changePassword(
    @Param('id') userId: string,
    @Body() data: ChangePassWordDTO,
  ) {
    await this.userService.changePassword(userId, data);
    return {
      messages: `xin chào nhật thành ${userId}`,
    };
  }
}
