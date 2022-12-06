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
    this.logger.log(qu.mobile, qu.info, 'sms-callback');
    try {
      const strs = qu.info.trim().toLowerCase().split(SmsKeySub);
      this.logger.log(strs[1] as unknown as number);
      const smsEntity = await this.smsService.findById(
        strs[1] as unknown as number,
      );
      if (!smsEntity) {
        return '0|yeu cau khong ton tai.';
      }

      if (!smsEntity.validTime()) {
        return '0|thoi gian hieu luc da het.';
      }

      const userEntitys = await this.userService.findByUserName(
        smsEntity.userName,
      );

      const userEntity = userEntitys[0];

      if (userEntity.phone !== qu.mobile) {
        return '0|So dien thoai khong khop trong tai khoa.';
      }

      let userUpdate: IUpdateUserDTO = {};
      let msg = '';
      switch (smsEntity.action) {
        case 'phonechange':
          msg = 'Đổi số điện thoại';
          userUpdate = {
            phone: smsEntity.info1,
          };
          break;
        case 'passwordchange':
          msg = 'Đổi mật khẩu game';
          userUpdate = {
            passWord: smsEntity.info1,
          };
          break;
        case 'secpasschange':
          msg = 'Đổi mật khẩu cấp 2';
          userUpdate = {
            passWordSecond: smsEntity.info1,
          };
          break;
        case 'secretquestionchange':
          msg = 'Đổi câu hỏi bí mật và trả lời';
          userUpdate = {
            question: smsEntity.info1,
            answer: smsEntity.info2,
          };
        case 'unlockequipment':
          msg = 'Mở khoá trang bị';
          userUpdate = {
            point: 1,
          };
          break;
        default:
          break;
      }

      await this.userService.update(smsEntity.userName, userUpdate);
      this.smsService.delete(smsEntity.id);
      return `0|${msg} thanh cong. Cam on ban da su dung dich vu.`;
    } catch (e: unknown) {
      const errors = e as Error;
      this.logger.error(errors.message, errors.name);
      return '0|Co loi, xin lien he gm.';
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
