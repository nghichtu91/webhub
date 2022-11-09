import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDTO } from '@modules/user/dtos';
import { LoginInputDTO } from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('Auth')
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
  login(@Body() data: LoginInputDTO) {
    return this.authService.jwtLogin(data);
  }

  @ApiBearerAuth()
  @Post('refresh')
  refresh() {
    return {};
  }

  // @JwtAuth()
  @Post('register')
  @HttpCode(200)
  @ApiOperation({ summary: 'Tạo tài khoản' })
  @ApiResponse({
    status: 200,
    description: 'Tạo tại thành công!',
  })
  @ApiCreatedResponse({
    description: 'Tạo tài khoản thành công!',
  })
  @ApiBadRequestResponse({
    description: 'Có lỗi trong quá trình đăng ký!',
  })
  register(@Body() data: CreateUserDTO) {
    return this.authService.jwtRegister(data);
  }
}
