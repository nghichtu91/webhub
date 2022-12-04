import { ISmsDTO } from './sms.dto';

export type ICreateSmsDTO = Pick<ISmsDTO, 'status'>;
