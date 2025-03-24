import { IAuthToken } from "./AuthToken";

export class AuthorizedUser implements IAuthToken {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  id: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  gender: string | undefined;
  email: string | undefined;
  username: string | undefined;
  image: string | undefined;

  constructor (initializer: Partial<AuthorizedUser> = {}) {
    Object.assign(this, initializer)
  }
}