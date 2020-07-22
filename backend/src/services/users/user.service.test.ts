import { logger } from '../../util/logger';
import { User, UserDocument } from '../../models/User';
import { UserService } from './user.service';
import { AuthenticationBody } from '../../types/authentication-body';
import { UserServiceHelper as helper } from './user-helper.service';

describe('UserService', () => {
  beforeEach(() => {
    logger.info = jest.fn();
    logger.debug = jest.fn();
    logger.error = jest.fn();
    User.findOne = jest.fn().mockReturnValue(Promise.resolve(mockFoundUser({})));
    helper.buildUserForLog = jest.fn().mockReturnValue('USER_FOR_LOG');
    helper.createJwt = jest.fn().mockReturnValue('JWT');
  });

  describe('authenticate', () => {
    it('throws an error when the username or password is falsy', async () => {
      try {
        await UserService.authenticate(<any>{ body: '' });
        expect(false).toBe(true);
      } catch (e) {
        expect(e.message).toBe('401');
      }
    });

    describe('when password verification succeeds', () => {
      let foundUser: UserDocument;

      beforeEach(() => {
        foundUser = mockFoundUser({
          email: 'EMAIL',
          password: 'PASSWORD'
        }, true);
        User.findOne = jest.fn().mockResolvedValue(foundUser);
      });

      it('logs an info message', async () => {
        await UserService.authenticate(mockReq({
          username: 'USERNAME',
          password: 'PASSWORD'
        }));

        expect(helper.buildUserForLog).toHaveBeenCalledWith({ userDocument: foundUser });
        expect(logger.info).toHaveBeenCalledWith({
          msg: 'User successfully authenticated',
          user: 'USER_FOR_LOG',
          transactionId: 'TRANSACTION_ID'
        });
      });

      it('returns a jwt created by the helper service', async () => {
        const returnValue = await UserService.authenticate(mockReq({
          username: 'USERNAME',
          password: 'PASSWORD'
        }));

        expect(returnValue).toBe('JWT');
        expect(helper.createJwt).toHaveBeenCalledWith(foundUser);
      });
    });

    describe('when password verification fails', () => {
      let foundUser: UserDocument;

      beforeEach(() => {
        foundUser = mockFoundUser({
          email: 'EMAIL',
          password: 'PASSWORD'
        }, false);
        User.findOne = jest.fn().mockResolvedValue(foundUser);
      });

      it('logs a debug message', async () => {
        try {
          await UserService.authenticate(mockReq({
            username: 'USERNAME',
            password: 'PASSWORD'
          }));
        } catch { }

        expect(helper.buildUserForLog).toHaveBeenCalledWith({ userDocument: foundUser });
        expect(logger.debug).toHaveBeenCalledWith({
          msg: 'User tried to authenticate with an incorrect password',
          user: 'USER_FOR_LOG',
          transactionId: 'TRANSACTION_ID'
        });
      });

      it('throws an error', async () => {
        try {
          await UserService.authenticate(mockReq({
            username: 'USERNAME',
            password: 'PASSWORD'
          }));
        } catch(e) {
          expect(e.message).toBe('401');
        }
      });
    });

    describe('error handling', () => {
      it('simply rethrows the error if the message is "401"', async () => {
        try {
          await UserService.authenticate(mockReq({
            username: 'USERNAME',
            password: 'PASSWORD'
          }));
          expect(false).toBe(true);
        } catch (e) {
          expect(e.message).toBe('401');
        }
      });

      it('logs the error, sets the message to "500" and rethrows when the error is not expected', async () => {
        const testError = new Error('TEST_ERROR');
        User.findOne = jest.fn().mockImplementation(() => {throw testError;});

        try {
          await UserService.authenticate(mockReq({
            username: 'USERNAME',
            password: 'PASSWORD'
          }));
          expect(false).toBe(true);
        } catch (e) {
          expect(e.message).toBe('500');
          expect(logger.error).toHaveBeenCalledWith(testError);
        }
      });
    });
  });
});

function mockReq(values: Partial<AuthenticationBody>): any {
  return <any>{
    body: {
      username: values.username || '',
      password: values.password || ''
    },
    headers: {
      'transaction-id': 'TRANSACTION_ID'
    }
  };
}

function mockFoundUser(userDetails: Partial<UserDocument>, comparePasswordReturnValue?: boolean): UserDocument {
  return <any>{
    comparePassword: () => comparePasswordReturnValue,
    email: userDetails.email || '',
    password: userDetails.password || ''
  };
}
