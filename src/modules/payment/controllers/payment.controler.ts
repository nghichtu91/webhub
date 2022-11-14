import { createHash } from 'node:crypto';
import {
  CardTypes,
  Commands,
  Gateways,
  PARTNER_ID,
  PARTNER_KEY,
} from '@config';
import {
  Injectable,
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth, ReqUser, User } from '@shared';
import { PaymentCallbackDTO } from '../dtos/callback.dto';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { PaymentService } from '../services';

@Injectable()
@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @JwtAuth()
  @ApiOperation({
    summary: 'Danh sách lịch sử nạp',
  })
  listHistory() {
    console.log('23');
  }

  @Post('callbackvvvv')
  @ApiOperation({
    summary: 'callback thẻ nạp',
  })
  @ApiBody({ type: PaymentCallbackDTO })
  cardCallback(@Body() callBody: PaymentCallbackDTO) {
    console.log(callBody);
  }

  //#region payment
  /**
   * @description api nạp thẻ và ghi thẻ vào đợi kiểm tra
   * @param {Gateways} gateway
   * @param {CreatePaymentDTO} data
   * @param {ReqUser} currentUser
   * @returns
   */
  @Post('gateway/:gateway')
  // @JwtAuth()
  @ApiOperation({ description: 'Nạp thẻ', summary: 'Nạp thẻ' })
  @ApiBody({ type: CreatePaymentDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ghi thẻ thành công',
  })
  @ApiNotFoundResponse({ description: 'Cổng nạp không hỗ trợ.' })
  checkout(
    @Param('gateway') gateway: Gateways,
    @Body() body: CreatePaymentDTO,
    @User() currentUser: ReqUser,
  ) {
    if (!Object.values(Gateways).includes(gateway)) {
      throw new HttpException(
        'Cổng nạp không hỗ trợ phương thức thanh toán này!',
        400,
      );
    }
    //add field miss
    const newPaymentData: CreatePaymentDTO = {
      ...body,
      userName: currentUser?.username || '',
      transactionId: '23',
      transaction: '232333',
      transactionCode: '23',
      gateway: gateway,
    };
    // call nhà cung cấp
    if (Gateways.AMT === gateway) {
      newPaymentData.cardType = CardTypes.ATM;
    }

    if (Gateways.MOBI_CARD === gateway) {
      //Chuẩn mã hoá MD5, thứ tự mã hóa chữ ký: partner_key + code + command + partner_id + request_id+serial+telco
      const request_id = '3';
      const signStr = `${PARTNER_KEY}${body.cardPin}${Commands.CHARGING}${PARTNER_ID}${request_id}${body.cardSeri}${body.cardType}`;
      const sign = createHash('md5').update(signStr).digest('hex');
      console.log(sign);
    }

    return this.paymentService.create(newPaymentData);
  }
  //#endregion
}
