export interface IUserInfo {
  _id?: string;
  username?: string;
  login?: string;
  avatarUrl?: string;
  url: string;
}

export interface IPost {
  _id?: string;
  poster?: IUserInfo;
  context: string;
  isPrivate: boolean;
  created?: Date;
}

export interface IPostClient {
  id?: string;
  poster?: string;
  context: string;
  isPrivate: boolean;
}

export interface IAuth {
  avatarUrl: string;
  exp: number;
  iat: number;
  id: string;
  login: string;
  nodeId: string;
  url: string;
  username: string;
}
