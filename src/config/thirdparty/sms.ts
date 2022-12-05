export type SmsActions =
  | 'phonechange'
  | 'passwordchange'
  | 'secpasschange'
  | 'secretquestionchange'
  | 'unlockequipment';

export const SmsServiceNumber = process.env.SMS_SERVICE_NUMBER || '8155';
export const SmsKeyPrimary = process.env.SMS_KEY_PRIMARY || 'ON';
export const SmsKeySub = process.env.SMS_KEY_SUB || 'PLV';
export const SmsHosts = process.env.SMS_HOSTS || '127.0.0.1|localhost';
export const SmsExpired = process.env.SMS_EXPIRED || 60; // Phút
