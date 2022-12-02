import {
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  HttpStatus,
  Body,
  HttpException,
  Res,
  Logger,
  Post,
} from '@nestjs/common';
import { UserService } from '../services';
import { JwtAuth, User, ReqUser, AppPermissionBuilder } from '@shared';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDTO, IUserModel, UserModel } from '../dtos';
import { Response } from 'express';
import { AppResources } from '@config';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { HttpStatusCode } from 'axios';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);
  constructor(
    private readonly userService: UserService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  @JwtAuth()
  @ApiOkResponse({
    description: 'Lấy danh sách tài khoản thành công',
    type: UserModel,
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server errors',
  })
  @Get('users')
  getUsers(@User() currentUser: ReqUser) {
    const permission = new AppPermissionBuilder()
      .setRolesBuilder(this.rolesBuilder)
      .setRequestUser(currentUser)
      .setAction('read')
      .setResourceName(AppResources.ADMIN)
      .setCreatorId(currentUser.id)
      .build()
      .grant();

    if (!permission.granted) {
      throw new HttpException(`Không có quyền truy cập`, HttpStatus.FORBIDDEN);
    }

    return 'hsjdh';
  }

  @Patch('users/:id')
  @ApiParam({ name: 'id', description: 'tài khoản cần chỉnh sửa' })
  updateUser() {
    return 'Update user by admin';
  }
}
