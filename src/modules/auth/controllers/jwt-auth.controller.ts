import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDTO } from '@modules/user/dtos';
import { JwtRefreshTokenDTO, LoginInputDTO } from '../dtos';
import { AuthService } from '../services';
import { JwtRefreshAuth, LocalAuth, ReqUser, User } from '@shared';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class JwtAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công!',
  })
  @ApiUnauthorizedResponse({
    description: 'Đăng nhập không thành công!',
  })
  @LocalAuth()
  login(@Body() data: LoginInputDTO) {
    return this.authService.jwtLogin(data);
  }

  @JwtRefreshAuth()
  @Post('refresh')
  @ApiOperation({ summary: 'lấy lại token mới' })
  @ApiBody({ type: JwtRefreshTokenDTO })
  refresh(@User() user: ReqUser) {
    return this.authService.jwtRefresh(user);
  }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo tài khoản' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo tại thành công!',
  })
  @ApiCreatedResponse({
    description: 'Tạo tài khoản thành công!',
  })
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình đăng ký!',
  })
  @ApiBody({ type: CreateUserDTO })
  register(@Body() data: CreateUserDTO) {
    return this.authService.jwtRegister(data);
  }
}
