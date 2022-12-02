import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  GUEST = 'GUEST',
}

export enum AppResources {
  USER = 'USER',
  PAYMENT = 'PAYMENT',
  ADMIN = 'ADMIN',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.GUEST)
  .readAny(AppResources.USER, '*, !email, !phoneNumber, !password')
  .createAny(AppResources.USER, '*, !roles')
  .grant(AppRoles.CUSTOMER)
  .readAny(AppResources.USER, '*, !password')
  .updateOwn(AppResources.USER, '*, !roles')
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.CUSTOMER)
  .createAny(AppResources.USER)
  .updateAny(AppResources.USER)
  .deleteAny(AppResources.USER)
  .createAny(AppResources.ADMIN)
  .updateAny(AppResources.ADMIN)
  .deleteAny(AppResources.ADMIN);
