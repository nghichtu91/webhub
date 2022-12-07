import {
  SmsActions,
  SmsKeyPrimary,
  SmsKeySub,
  SmsMsgFailed,
  SmsServiceNumber,
  SmsMsgExpired,
  SmsMsgNotFound,
  SmsMsgPhoneNotMatch,
  SmsMsgChangePhoneSuccessfully,
  SmsMsgChangePassWordSuccessfully,
  SmsMsgChangeSecPhoneSuccessfully,
  SmsMsgUnlockEquipmentSuccessfully,
  SmsMsgChangeSecretQuestionSuccessfully,
} from '@config';
import { IUpdateUserDTO } from '@modules/user/dtos';
import { UserService } from '@modules/user/services';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
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

  // @Post('sms-callback')
  // async callbacksms(@Body() body: CallbackDTO) {
  //   this.logger.log(body.mobile, 'sms-callback');
  //   try {
  //     const smsEntity = await this.smsService.findById(
  //       body.info.trim() as unknown as number,
  //     );
  //     if (!smsEntity) {
  //       return '0|Yêu cầu không tồn tại.';
  //     }

  //     if (!smsEntity.validTime()) {
  //       return '0|Thời gian hiệu lực hết hạn.';
  //     }

  //     const userEntitys = await this.userService.findByUserName(
  //       smsEntity.userName,
  //     );

  //     const userEntity = userEntitys[0];

  //     if (userEntity.phone !== body.mobile) {
  //       return '0|Số điện thoại không khớp trong tài khoản.';
  //     }

  //     let userUpdate: IUpdateUserDTO = {};
  //     let msg = '';
  //     switch (smsEntity.action) {
  //       case 'phonechange':
  //         msg = 'Đổi số điện thoại';
  //         userUpdate = {
  //           phone: smsEntity.info1,
  //         };
  //         break;
  //       case 'passwordchange':
  //         msg = 'Đổi mật khẩu game';
  //         userUpdate = {
  //           passWord: smsEntity.info1,
  //         };
  //         break;
  //       case 'secpasschange':
  //         msg = 'Đổi mật khẩu cấp 2';
  //         userUpdate = {
  //           passWordSecond: smsEntity.info1,
  //         };
  //         break;
  //       case 'secretquestionchange':
  //         msg = 'Đổi câu hỏi bí mật và trả lời';
  //         userUpdate = {
  //           question: smsEntity.info1,
  //           answer: smsEntity.info2,
  //         };
  //       case 'unlockequipment':
  //         msg = 'Mở khoá trang bị';
  //         userUpdate = {
  //           point: 1,
  //         };
  //         break;
  //       default:
  //         break;
  //     }

  //     await this.userService.update(smsEntity.userName, userUpdate);
  //     this.smsService.delete(smsEntity.id);
  //     return `0|${msg} thành công. Cảm ơn bạn đã sử dụng dịch vụ.`;
  //   } catch (e: unknown) {
  //     const errors = e as Error;
  //     this.logger.error(errors.message, errors.name);
  //     return '0|Có lỗi trong quá trình xử lý, vui lòng liên hệ gm.';
  //   }
  // }

  @Get('sms-callback')
  async getcallbacksms(@Query() qu: CallbackDTO) {
    this.logger.log(`${qu.mobile}`, 'sms-callback');
    try {
      const strs = qu.info.trim().toLowerCase().split(SmsKeySub.toLowerCase());
      this.logger.log(strs[1].trim() as unknown as number);
      const smsEntity = await this.smsService.findById(
        strs[1] as unknown as number,
      );
      if (!smsEntity) {
        return `0|${SmsMsgNotFound}`;
      }

      if (!smsEntity.validTime()) {
        this.smsService.update(smsEntity.id, { status: 2 });
        return `0|${SmsMsgExpired}`;
      }

      const userEntitys = await this.userService.findByUserName(
        smsEntity.userName,
      );

      const userEntity = userEntitys[0];

      if (userEntity.phone !== `0${qu.mobile.substring(2)}`) {
        return `0|${SmsMsgPhoneNotMatch}`;
      }

      let userUpdate: IUpdateUserDTO = {};
      let msg = '';
      switch (smsEntity.action) {
        case 'phonechange':
          msg = SmsMsgChangePhoneSuccessfully.replace('%s', smsEntity.info1);
          userUpdate = {
            phone: smsEntity.info1,
          };
          break;
        case 'passwordchange':
          msg = SmsMsgChangePassWordSuccessfully.replace('%s', smsEntity.info1);
          userUpdate = {
            passWord: smsEntity.info1,
          };
          break;
        case 'secpasschange':
          msg = SmsMsgChangeSecPhoneSuccessfully.replace('%s', smsEntity.info1);
          userUpdate = {
            passWordSecond: smsEntity.info1,
          };
          break;
        case 'secretquestionchange':
          msg = SmsMsgChangeSecretQuestionSuccessfully.replace(
            '%s',
            smsEntity.info1,
          ).replace('%c', smsEntity.info2);
          userUpdate = {
            question: smsEntity.info1,
            answer: smsEntity.info2,
          };
        case 'unlockequipment':
          msg = SmsMsgUnlockEquipmentSuccessfully;
          userUpdate = {
            point2: 1,
          };
          break;
        default:
          break;
      }

      await this.userService.update(smsEntity.userName, userUpdate);
      this.smsService.update(smsEntity.id, { status: 1 });

      return `0|${msg}`;
    } catch (e: unknown) {
      const errors = e as Error;
      this.logger.error(errors.message, errors.name);
      return `0|${SmsMsgFailed}`;
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
