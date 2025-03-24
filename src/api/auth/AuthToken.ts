export interface IAuthToken {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export class AuthToken implements IAuthToken {
  accessToken: string;
  refreshToken: string;

  constructor (accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
