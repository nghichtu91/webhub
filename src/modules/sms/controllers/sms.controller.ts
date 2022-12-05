import {
  SmsActions,
  SmsKeyPrimary,
  SmsKeySub,
  SmsServiceNumber,
} from '@config';
import { IUpdateUserDTO } from '@modules/user/dtos';
import { UserService } from '@modules/user/services';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth, ReqUser, User } from '@shared';
import { CallbackDTO } from '../dto/callback.dto';
import { CreateDTO } from '../dto/create.dto';
import { CreateSmsParams } from '../dto/create.param';
import { SmsService } from '../services';

@Controller('sms')
@ApiTags('sms')
export class SmsController {
  private readonly logger = new Logger(SmsController.name);

  constructor(
    private readonly smsService: SmsService,
    private readonly userService: UserService,
  ) {}

  @Post('sms-callback')
  async callbacksms(@Body() body: CallbackDTO) {
    try {
      const smsEntity = await this.smsService.findById(
        body.info.trim() as unknown as number,
      );
      if (!smsEntity) {
        throw new HttpException(
          `Yêu cầu không tồn tại.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!smsEntity.validTime()) {
        throw new HttpException(
          'Thời gian hiệu lực hết hạn.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userEntitys = await this.userService.findByUserName(
        smsEntity.userName,
      );

      const userEntity = userEntitys[0];

      if (userEntity.phone !== body.mobile) {
        throw new HttpException(
          'Số điện thoại không khớp trong tài khoản',
          HttpStatus.BAD_REQUEST,
        );
      }

      let userUpdate: IUpdateUserDTO = {};
      switch (smsEntity.action) {
        case 'phonechange':
          userUpdate = {
            phone: smsEntity.info1,
          };
          break;
        case 'passwordchange':
          userUpdate = {
            passWord: smsEntity.info1,
          };
          break;
        case 'secpasschange':
          userUpdate = {
            passWordSecond: smsEntity.info1,
          };
          break;
        case 'secretquestionchange':
          userUpdate = {
            question: smsEntity.info1,
            answer: smsEntity.info2,
          };
          break;
        default:
          break;
      }

      await this.userService.update(smsEntity.userName, userUpdate);
      this.smsService.delete(smsEntity.id);
    } catch (e: unknown) {
      const errors = e as Error;
      this.logger.error(errors.message, errors.name);
      throw new HttpException(`Có lỗi từ hệ thống`, HttpStatus.BAD_REQUEST);
    }
  }

  @JwtAuth()
  @Post('sms-request/:action')
  @ApiOperation({ summary: 'Tạo yêu thay đổi thông bằng sms' })
  @ApiOkResponse()
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Server error',
  })
  async smsRequest(
    @Param('action') action: SmsActions,
    @Body() body: CreateSmsParams,
    @User() currentUser: ReqUser,
  ) {
    if (!currentUser || !currentUser.username) {
      throw new HttpException(``, HttpStatus.UNAUTHORIZED);
    }

    const data = new CreateDTO(body);
    data.action = action;
    data.userName = currentUser.username;

    try {
      const smsCreated = await this.smsService.add(data);
      this.logger.log(
        `${currentUser.username} tạo yêu xử lý bằng sms thành công!`,
      );
      return {
        message: `${SmsKeyPrimary} ${SmsKeySub} ${smsCreated.id} gửi ${SmsServiceNumber}.`, // code send sms
      };
    } catch (e: unknown) {
      const errors = e as Error;
      this.logger.log(
        `${currentUser.username} Tạo yêu xử lý bằng sms thất bại. ${errors.message}`,
        errors.name,
      );
      throw new HttpException(``, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
