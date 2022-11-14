import { CardTypes, Gateways } from '@config';
import {
  Injectable,
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth, ReqUser, User } from '@shared';
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

  /**
   * @description api nạp thẻ và ghi thẻ vào đợi kiểm tra
   * @param {Gateways} geteway
   * @param {CreatePaymentDTO} data
   * @param {ReqUser} currentUser
   * @returns
   */
  @Post(':gateway')
  @JwtAuth()
  @ApiOperation({ description: 'Nạp thẻ', summary: 'Nạp thẻ' })
  @ApiBody({ type: CreatePaymentDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ghi thẻ thành công',
  })
  @ApiNotFoundResponse({ description: 'Cổng nạp không hỗ trợ.' })
  checkout(
    @Param('gateway') geteway: Gateways,
    @Body() body: CreatePaymentDTO,
    @User() currentUser: ReqUser,
  ) {
    if (!Object.values(Gateways).includes(geteway)) {
      throw new HttpException(
        'Cổng nạp không hỗ trợ phương thức thanh toán này!',
        400,
      );
    }

    // call nhà cung cấp

    //add field miss
    const newPaymentData: CreatePaymentDTO = {
      ...body,
      userName: currentUser.username,
      transactionId: '23',
      transaction: '232333',
      transactionCode: '23',
      gateway: geteway,
    };

    if (Gateways.AMT === geteway) {
      newPaymentData.cardType = CardTypes.ATM;
    }
    return this.paymentService.create(newPaymentData);
  }
}
