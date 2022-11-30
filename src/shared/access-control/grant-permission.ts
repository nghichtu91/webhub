import { Permission } from 'accesscontrol';
import { RolesBuilder } from 'nest-access-control';

import { AppResources } from '@config';
import { Action, IReqUser } from '@shared';

/**
 *
 * @param rolesBuilder
 * @param resource
 * @param action
 * @param param3 Include `id`: string, `roles`: Role[] of `ReqUser`
 * @param creatorId The resource creator
 */
export function grantPermission(
  rolesBuilder: RolesBuilder,
  resource: AppResources,
  action: Action,
  { id, roles }: IReqUser,
  creatorId: any,
): Permission {
  let behavior: string;

  if (id && creatorId)
    behavior = `${action}${id === creatorId ? 'Own' : 'Any'}`;
  else behavior = `${action}Any`;

  return rolesBuilder.can(roles)[behavior + ''](resource); // similar with `const permission: Permission = rolesBuilder.can(roles).readOwn(resource);`
}
