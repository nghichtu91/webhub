export interface IReqUser {
  id?: string;
  username?: string;
  roles?: any;
}

export class ReqUser implements IReqUser {
  id?: string;
  username?: string;
  roles?: any;
  getSessionId?: () => string;
}
