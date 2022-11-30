import {
  Commands,
  Gateways,
  PARTNER_ID,
  PARTNER_KEY,
  PaymentStatus,
  CardPriceList,
  Cardbonus,
  Atmkey,
  AtmProportion,
  roles,
  AppRoles,
  AppResources,
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
  Query,
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
import { AtmCallbackDTO } from '../dtos';
import { PaymentEntity } from '../entities';

interface IPageReponse<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

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
    return Math.floor(CardPriceList[price] + Cardbonus * CardPriceList[price]);
  }

  getCoinForAtm(price: number) {
    let bonus = 1;
    if (price < 1100000) {
      bonus = 1.1;
    }
    if (price >= 1100000 && price < 2000000) {
      bonus = 1.15;
    }
    if (price >= 2000000 && price <= 10000000) {
      bonus = 1.2;
    }
    return Math.floor((price / AtmProportion) * bonus);
  }

  @Get(':username')
  @JwtAuth({
    resource: AppResources.USER,
    action: 'read',
    possession: 'any',
  })
  @ApiOperation({
    summary: 'Danh sách lịch sử nạp',
  })
  async listHistory(
    @Param('username') username: string,
    @Query('paged') paged: number,
  ) {
    const total = await this.paymentService.getTotalByUserName(username);
    const payments = await this.paymentService.getPaymentsByUsername(
      username,
      paged,
    );

    const vv: IPageReponse<PaymentEntity> = {
      pageNum: paged,
      pageSize: 12,
      total: total,
      data: payments,
    };
    return vv;
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

  @Post('callback-atm')
  @ApiOperation({
    summary: 'callback atm',
  })
  async atmCallback(@Body() body: AtmCallbackDTO) {
    const { so_tien, ten_bank, trans_id, id_khach } = body;
    if (body.ma_baoMat !== Atmkey) {
      this.logger.error('[AtmCallback] mã bảo mật không đúng!');
      throw new HttpException(`Mã bảo mật không đúng!`, 400);
    }
    if (so_tien < 50000) {
      this.logger.error('[AtmCallback] Số tiền nhỏ hơn 20.000 vnd!');
      throw new HttpException(`Số tiền nhỏ hơn 20.000 vnd!`, 400);
    }
    const user = await this.userService.findByUserName(id_khach);
    if (!user[0]) {
      throw new HttpException(`Không tìm thấy tài khoản ${id_khach}`, 400);
    }
    const coin = this.getCoinForAtm(so_tien);
    const newPaymentData: CreatePaymentDTO = {
      cardValue: so_tien,
      userName: id_khach,
      transactionId: trans_id,
      transactionCode: trans_id,
      gateway: 'atm',
      comment: `${ten_bank}`,
      status: 1,
      coin: coin,
    };
    this.paymentService.create(newPaymentData);
    try {
      await this.userService.addMoney(id_khach, coin);
      this.logger.log(
        `[AtmCallback] tài khoản ${id_khach} nạp ${so_tien} vnd, nhận được ${coin} xu.`,
      );
    } catch (e) {
      console.log(e);
      this.logger.error(
        `[AtmCallback] tài khoản ${id_khach} có lỗi trong quá trình cộng xu, số xu chưa cộng được ${coin}`,
      );
    }
    return true;
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
        cardValue: cardValue,
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
          newPaymentData.comment = '';
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
