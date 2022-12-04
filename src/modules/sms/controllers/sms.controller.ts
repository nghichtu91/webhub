import { SmsActions } from '@config';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuth, ReqUser, User } from '@shared';
import { CallbackDTO } from '../dto/callback.dto';
import { CreateDTO } from '../dto/create.dto';
import { CreateSmsParams } from '../dto/create.param';
import { SmsService } from '../services';

@Controller()
@ApiTags('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Get('sms-callback')
  callbacksms(@Body() body: CallbackDTO) {
    console.log(body);
    return {};
  }

  @JwtAuth()
  @Post('sms-request/:action')
  smsRequest(
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
    data.code = 111;
    data.status = 1;
    data.time = new Date().getTime();
    return data;
  }
}
