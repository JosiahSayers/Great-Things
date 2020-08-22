import { User, UserDocument } from '../../models/User';
import { AuthenticationBody } from '../../types/authentication-body';
import { UserServiceHelper as helper } from './user-helper.service';
import { logger } from '../../util/logger';
import { Request } from 'express';
import { RegisterBody } from '../../types/register-body';

const authenticate = async (req: Request): Promise<string> => {
  let jwt;
  const auth: AuthenticationBody = req.body;

  if (!auth.username || !auth.password) {
    throw new Error('401');
  }

  try {
    const user = await User.findOne({ email: auth.username });
    if (!user) {
      throw new Error('401');
    }
    
    const correctPassword = user.comparePassword(auth.password);

    if (correctPassword) {
      logger.info({
        msg: 'User successfully authenticated',
        user: helper.buildUserForLog({ userDocument: user }),
        transactionId: req.headers['transaction-id']
      });

      jwt = helper.createJwt(user);
    } else {
      logger.debug({
        msg: 'User tried to authenticate with an incorrect password',
        user: helper.buildUserForLog({ userDocument: user }),
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

const register = async (req: Request): Promise<string> => {
  let jwt;
  const auth: RegisterBody = req.body;
  
  try {
    const isValidEmail = await helper.isValidEmail(auth.username);
    const isValidPass = helper.isValidPassword(auth.password);

    if (!isValidEmail || !isValidPass) {
      throw new Error('400');
    }

    const user = await new User(<UserDocument>{
      email: auth.username,
      password: auth.password,
      profile: {
        name: auth.name,
        picture: auth.picture
      }
    }).save();

    jwt = helper.createJwt(user);

    logger.info({
      msg: 'User successfully registered',
      registration: helper.buildUserForLog({ userDocument: user }),
      transactionId: <string>req.headers['transaction-id']
    });
  } catch (e) {
    if (e.message === '400') {
      logger.debug({
        msg: 'User tried to register with an invalid email or password',
        registration: {
          email: auth.username
        },
        transactionId: <string>req.headers['transaction-id']
      });
    } else {
      logger.error({
        msg: 'User tried to register with the following information:',
        registration: {
          email: auth.username,
          profile: {
            name: auth.name,
            picture: auth.picture
          }
        },
        error: e,
        transactionId: <string>req.headers['transaction-id']
      });
      e.message = '500';
    }

    throw e;
  }

  return jwt;
};

const refresh = (req: Request): string => {
  try {
    const jwt = helper.refreshJwt(req.jwt);

    logger.info({
      msg: 'User successfully refreshed their JWT',
      transactionId: req.headers['transaction-id'],
      user: helper.buildUserForLog({ jwt: req.jwt })
    });

    return jwt;

  } catch (e) {
    logger.error({
      msg: 'User encountered an error while refreshing their JWT',
      transactionId: req.headers['transaction-id'],
      user: helper.buildUserForLog({ jwt: req.jwt }),
      error: e
    });
    e.message = '500';
    throw e;
  }
};

export const UserService = {
  authenticate,
  register,
  refresh
};
