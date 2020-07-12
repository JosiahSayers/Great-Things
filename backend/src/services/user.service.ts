import { User } from '../models/User';
import { AuthenticationBody } from '../types/authentication-body';
import { UserServiceHelper as helper } from './user-helper.service';
import { logger } from '../util/logger';
import { Request } from 'express';

const authenticate = async (req: Request): Promise<string> => {
  let jwt;
  const auth: AuthenticationBody = req.body;

  if (!auth.username || !auth.password) {
    throw new Error('401');
  }
  try {
    const user = await User.findOne({ email: auth.username });
    const correctPassword = user.comparePassword(auth.password);

    if (correctPassword) {
      logger.info({
        msg: 'User successfully authenticated',
        user: helper.buildUserForLog(user),
        transactionId: req.headers['transaction-id']
      });

      jwt = helper.createJwt(user);
    } else {
      logger.debug({
        msg: 'User tried to authenticate with an incorrect password',
        user: helper.buildUserForLog(user),
        transactionId: <string>req.headers['transaction-id']
      });

      throw new Error('401');
    }

    return jwt;

  } catch (e) {
    if (e.message !== '401') {
      logger.error(e);
      e.message = '500';
    }
    throw e;
  }
};

export const UserService = {
  authenticate
};
