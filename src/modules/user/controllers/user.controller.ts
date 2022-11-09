import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth } from '@shared';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDTO } from '../dtos/update.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @JwtAuth()
  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return {
      messages: `xin chào nhật thành ${userId}`,
    };
  }
  @JwtAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin' })
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình cập nhật!',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async updateUser(@Param('id') userId: string, @Body() data: UpdateUserDTO) {
    return {
      messages: `xin chào nhật thành ${userId}`,
    };
  }
}
