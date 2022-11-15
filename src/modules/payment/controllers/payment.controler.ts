import { createHash } from 'node:crypto';
import {
  CardTypes,
  Commands,
  Gateways,
  PARTNER_ID,
  PARTNER_KEY,
  PaymentStatus,
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
import { firstValueFrom } from 'rxjs';

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
   * @param {CreatePaymentDTO} body
   * @param {ReqUser} currentUser
   * @returns
   */
  @Post('gateway/:gateway')
  @JwtAuth()
  @ApiOperation({ description: 'Nạp thẻ', summary: 'Nạp thẻ' })
  @ApiBody({ type: CreatePaymentDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ghi thẻ thành công',
  })
  @ApiNotFoundResponse({ description: 'Cổng nạp không hỗ trợ.' })
  async checkout(
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

    if (Gateways.MOBI_CARD === gateway) {
      //Chuẩn mã hoá MD5, thứ tự mã hóa chữ ký: partner_key + code + command + partner_id + request_id+serial+telco
      const { cardPin, cardSeri, cardType, cardValue } = body;
      const request_id = `${currentUser.username}${cardSeri}`;
      const signStr = `${PARTNER_KEY}${cardPin}${Commands.CHARGING}${PARTNER_ID}${request_id}${cardSeri}${cardType}`;
      const sign = createHash('md5').update(signStr).digest('hex');
      const cardInfo = {
        telco: cardType,
        code: cardPin,
        serial: cardSeri,
        amount: cardValue,
        request_id: request_id,
        partner_id: PARTNER_ID,
        command: Commands.CHARGING,
        sign: sign,
      };
      const { data } = await firstValueFrom(
        this.paymentService.checkCardMobi(cardInfo).pipe(),
      );
      //add field miss
      const newPaymentData: CreatePaymentDTO = {
        ...body,
        cardValue: 0,
        userName: currentUser?.username || '',
        transactionId: data.trans_id,
        transactionCode: request_id,
        gateway: gateway,
        comment: data.message,
        status: data.status,
      };
      switch (data.status) {
        // card lỗi
        case PaymentStatus.FAILED:
          throw new HttpException(
            'Thẻ không đúng, vui lòng sử dụng thẻ khác!',
            HttpStatus.PAYMENT_REQUIRED,
          );
        // hệ thống bảo trì
        case PaymentStatus.MAINTENANCE:
          throw new HttpException(
            'Hệ thống nạp thể đang bảo trì, vui lòng sử dụng lại sau.',
            HttpStatus.ACCEPTED,
          );
        // card đang chờ
        case PaymentStatus.PENDING:
          this.paymentService.create(newPaymentData);
          throw new HttpException(
            'Thể được thêm vào hệ thống, đang đợi kiểm tra!',
            HttpStatus.ACCEPTED,
          );
        // card sai mệnh giá
        case PaymentStatus.FAILEDAMOUNT:
          newPaymentData.coin = data.value / 10;
          newPaymentData.cardValue = data.value;
          this.paymentService.create(newPaymentData);
          throw new HttpException(
            'Thể được thêm vào hệ thống, nhưng sai mệnh giá.',
            HttpStatus.ACCEPTED,
          );
        // card đúng
        case PaymentStatus.SUCCEEDED:
          newPaymentData.coin = data.value / 10;
          newPaymentData.cardValue = data.value;
          this.paymentService.create(newPaymentData);
          throw new HttpException(
            'Nạp thẻ thành công, chúc bạn chơi game vui vẻ!!',
            HttpStatus.CREATED,
          );
        default:
          throw new HttpException(
            'Có lỗi vui lòng thử lại sau!',
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }
  //#endregion
}
