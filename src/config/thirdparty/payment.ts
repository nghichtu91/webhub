export enum CardTypes {
  VIETTEL = 'VIETTEL',
  VINAPHONE = 'VINAPHONE',
  MOBIFONE = 'MOBIFONE',
  ATM = 'ATM',
}
export enum Gateways {
  AMT = 'atm',
  MOBI_CARD = 'mobi',
}

export enum Commands {
  'CHARGING' = 'charging',
  'CHECK' = 'check',
}

export const CardPriceList = {
  10000: 20,
  20000: 40,
  30000: 60,
  50000: 100,
  100000: 200,
  200000: 400,
  300000: 600,
  500000: 1000,
  1000000: 2000,
};

export const Cardbonus = +process.env.CARD_BONUS || 0; // tính %;
export const GATEWAY_URL = 'http://naptudong.com/chargingws/v2';
export const PARTNER_ID = '6471455261';
export const PARTNER_KEY = '486b5afa44dc72a2c8cd991bc7f2a44e';

/**
 * 
  @description 99 = CHỜ, 1 = THẺ ĐÚNG, 2 = THẺ SAI MỆNH GIÁ, 3 = THẺ LỖI, 4 = BẢO TRÌ
 */
export type StatusPayment = '1' | '2' | '3' | '4' | '99';
export enum PaymentStatus {
  PENDING = '99',
  SUCCEEDED = '1',
  FAILEDAMOUNT = '2',
  FAILED = '3',
  MAINTENANCE = '4',
}

export const ATM_KEY = process.env.ATM_KEY || 'giahuyz_vlhoiucvn';
export const ATM_RATE = +process.env.ATM_RATE || 500;
export const ATM_LINK = process.env.ATM_LINK || 'https://dantri.com.vn/';
