import { AuthUserEntity } from 'src/auth/Base/AuthUserEntity';
import { IServiceResponse } from 'src/common/interfaces/response.type';
import { UserResult } from '../dto/user.dto';

export interface IUserController {
  getUser(user: AuthUserEntity): Promise<IServiceResponse<UserResult>>;
  getAllUsers(user: AuthUserEntity): Promise<IServiceResponse<UserResult[]>>;
}
