import { AuthenticationBody } from './authentication-body';

export interface RegisterBody extends AuthenticationBody {
  name: string;
  pictureId?: string;
}
