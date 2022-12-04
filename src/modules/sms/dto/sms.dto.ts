import { SmsActions } from '@config';

export interface ISmsDTO {
  userName: string;
  action: SmsActions;
  time: number;
  status: number;
  code: number;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  info5?: string;
}

export class SmsDTO implements ISmsDTO {
  userName: string;
  action: SmsActions;
  time: number;
  status: number;
  code: number;
  info1?: string;
  info2?: string;
  info3?: string;
  info4?: string;
  info5?: string;
}
