export enum CardTypes {
  VIETTEL = 'VIETTEL',
  VINAPHONE = 'VINAPHONE',
  VTC = 'VTC',
  GATE = 'GATE',
  ZING = 'ZING',
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

export const PARTNER_ID = '7908566351';
export const PARTNER_KEY = '9da6fab8bb728a5b024b3126f53a90ef';

/**
 * 
  @description 99 = CHỜ, 1 = THẺ ĐÚNG, 2 = THẺ SAI MỆNH GIÁ, 3 = THẺ LỖI, 4 = BẢO TRÌ
 */
export type StatusPayment = '1' | '2' | '3' | '4' | '99';
