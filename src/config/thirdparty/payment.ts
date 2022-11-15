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

export const PARTNER_ID = '6471455261';
export const PARTNER_KEY = '486b5afa44dc72a2c8cd991bc7f2a44e';

/**
 * 
  @description 99 = CHỜ, 1 = THẺ ĐÚNG, 2 = THẺ SAI MỆNH GIÁ, 3 = THẺ LỖI, 4 = BẢO TRÌ
 */
export type StatusPayment = 1 | 2 | 3 | 4 | 99;
export enum PaymentStatus {
  PENDING = 99,
  SUCCEEDED = 1,
  FAILEDAMOUNT = 2,
  FAILED = 3,
  MAINTENANCE = 4,
}
