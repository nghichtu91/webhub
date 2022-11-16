import {
  Commands,
  Gateways,
  PARTNER_ID,
  PARTNER_KEY,
  PaymentStatus,
  CardPriceList,
  Cardbonus,
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
  Logger,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth, ReqUser, User, CreateMD5 } from '@shared';
import { PaymentCallbackDTO } from '../dtos/callback.dto';
import { CreatePaymentDTO } from '../dtos/create.dto';
import { PaymentService } from '../services';
import { firstValueFrom } from 'rxjs';
import { UserService } from '@modules/user/services';

@Injectable()
@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
  ) {}
  /**
   * @description tính số xu được cộng vào tài khoản.
   * @param price
   * @returns
   */
  getCoin(price: string | number) {
    this.logger.log(
      `[Xu nhận được] ${CardPriceList[price]} khuyến mãi thêm ${
        Cardbonus * CardPriceList[price]
      }`,
    );
    return CardPriceList[price] + Cardbonus * CardPriceList[price];
  }

  @Get()
  @JwtAuth()
  @ApiOperation({
    summary: 'Danh sách lịch sử nạp',
  })
  listHistory() {
    console.log('23');
  }
  @Post('callback-mobicard')
  @ApiOperation({
    summary: 'callback thẻ nạp',
  })
  @ApiBody({ type: PaymentCallbackDTO })
  async cardCallback(@Body() body: PaymentCallbackDTO) {
    const { status, trans_id, value, message, sign, code, serial } = body;
    const signStr = CreateMD5(`${PARTNER_KEY}${code}${serial}`);
    if (sign !== signStr) {
      this.logger.error(
        `[cardCallback] chữ ký sai ${sign} # ${signStr} ${PARTNER_KEY}${code}${serial}`,
      );
      throw new HttpException(
        `Không tìm thấy mã giao dịch!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const paylog = await this.paymentService.getUserNameByTransId(trans_id);
    if (!paylog) {
      this.logger.error(`[cardCallback] không tìm thấy ${trans_id}`, '');
      throw new HttpException(
        `Không tìm thấy mã giao dịch!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    this.paymentService.updateStatus(trans_id, status, message);
    this.logger.log(
      `[cardCallback][${trans_id}] Đổi trạng thái từ ${paylog.status} ----> ${status}`,
    );
    switch (status) {
      // card sai mệnh giá
      case PaymentStatus.FAILEDAMOUNT:
        this.logger.log(
          `[cardCallback][${trans_id}] Tài khoản ${paylog.userName} nạp thẻ nhưng sai mệnh giá. Giá trị thật là ${body.value}, giá khai báo ${body.declared_value}.`,
        );
        throw new HttpException(`Thẻ sai mệnh giá`, HttpStatus.BAD_REQUEST);
      // card đúng
      case PaymentStatus.SUCCEEDED:
        const coin = this.getCoin(value);
        this.logger.log(
          `[cardCallback][${trans_id}] Tài khoản ${paylog.userName} nạp thẻ thành công, mệnh giá ${body.value} nhận được ${coin}.`,
        );
        this.userService.addMoney(paylog.userName, coin);
        break;
      default:
        this.logger.log(`[cardCallback][${trans_id}] Thẻ lỗi.`);
        throw new HttpException(
          `Không tìm thấy mã giao dịch!`,
          HttpStatus.BAD_REQUEST,
        );
    }
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
  @ApiOperation({ summary: 'Nạp thẻ' })
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

    if (!Object.keys(CardPriceList).includes(body.cardValue.toString())) {
      throw new HttpException('Cổng nạp không hỗ trợ mệnh giá này!', 400);
    }

    const { username } = currentUser;
    if (Gateways.MOBI_CARD === gateway) {
      const { cardPin, cardSeri, cardType, cardValue } = body;
      const request_id = `${username}${cardSeri}`;
      const signStr = `${PARTNER_KEY}${cardPin}${Commands.CHARGING}${PARTNER_ID}${request_id}${cardSeri}${cardType}`;
      const sign = CreateMD5(signStr);
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
        userName: username,
        transactionId: request_id,
        transactionCode: data.trans_id,
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
            'Thẻ được thêm vào hệ thống, đang đợi kiểm tra!',
            HttpStatus.ACCEPTED,
          );
        // card sai mệnh giá
        case PaymentStatus.FAILEDAMOUNT:
          this.logger.log(
            `[checkout][${data.trans_id}] Tài khoản ${username} nạp thẻ thành công, nhưng sai mệnh giá. Giá trị thật là ${data.value}, giá khai báo ${data.declared_value}.`,
          );
          throw new HttpException('Thẻ sai mệnh giá!', HttpStatus.BAD_REQUEST);
        // card đúng
        case PaymentStatus.SUCCEEDED:
          const coin = this.getCoin(data.value);
          newPaymentData.coin = coin;
          newPaymentData.cardValue = data.value;
          this.paymentService.create(newPaymentData);
          this.userService.addMoney(currentUser.username, coin);
          this.logger.log(
            `[checkout][${data.trans_id}] Tài khoản ${username} nạp thẻ thành công, mệnh giá ${data.value} nhận được ${coin}.`,
          );
          throw new HttpException(
            PaymentStatus.SUCCEEDED === data.status
              ? 'Nạp thẻ thành công, chúc bạn chơi game vui vẻ!'
              : 'Thẻ được thêm vào hệ thống, nhưng sai mệnh giá.',
            HttpStatus.CREATED,
          );
        default:
          this.logger.error(data.message, currentUser.username);
          throw new HttpException(
            'Có lỗi vui lòng thử lại sau!',
            HttpStatus.BAD_REQUEST,
          );
      }
    }
  }
  //#endregion
}
