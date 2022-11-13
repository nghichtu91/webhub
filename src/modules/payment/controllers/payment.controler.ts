import { gateways } from '@config';
import { Injectable, Controller, Post, Get, Body, Param } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuth } from '@shared';
import { CreatePaymentDTO } from '../dtos/create.dto';

@Injectable()
@Controller('payments')
@ApiTags('Payment')
export class PaymentController {
  @Get()
  @JwtAuth()
  @ApiOperation({
    summary: 'Danh sách lịch sử nạp',
  })
  listHistory() {
    console.log('23');
  }
  @Post(':gateway')
  @JwtAuth()
  @ApiOperation({ description: 'Nạp thẻ', summary: 'Nạp thẻ' })
  @ApiBody({ type: CreatePaymentDTO })
  checkout(
    @Param('gateway') geteway: gateways,
    @Body() data: CreatePaymentDTO,
  ) {
    console.log(data, geteway);
  }
}
