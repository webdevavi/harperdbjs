export interface HarperDBAuth {
  url: string
  username: string
  password: string
}

export interface IHarperDB {
  get auth(): HarperDBAuth
}

/**
 * The main class to connect with HarperDB
 */
export class HarperDB implements IHarperDB {
  private url: string
  private username: string
  private password: string

  /**
   *
   * @param {HarperDBAuth} options The authentication params to connect with HarperDB
   */
  constructor({ url, username, password }: HarperDBAuth) {
    this.url = url
    this.username = username
    this.password = password
  }

  /**
   * The current auth options being used to connect with HarperDB
   *
   * @return {HarperDBAuth} Auth options - url, username & password
   */
  get auth(): HarperDBAuth {
    return {
      url: this.url,
      username: this.username,
      password: this.password,
    }
  }
}
