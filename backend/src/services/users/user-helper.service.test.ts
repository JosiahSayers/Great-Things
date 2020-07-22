import { UserServiceHelper } from './user-helper.service';
import jwt from 'jsonwebtoken';
import { UserDocument, User } from '../../models/User';
import { JWT_SECRET } from '../../util/environment';
import { UserJWT } from '../../types/jwt';

const testUserDoc = <UserDocument>{
  email: 'EMAIL',
  id: 'ID',
  _id: 'ID',
  profile: {
    name: 'NAME',
    picture: 'PICTURE'
  }
};

const testJwt = <UserJWT>{
  email: 'EMAIL',
  id: 'ID',
  name: 'NAME',
  picture: 'PICTURE'
};

describe('User Service Helper', () => {
  beforeEach(() => {
    jwt.sign = jest.fn().mockReturnValue('JWT');
  });

  describe('createJwt', () => {
    it('uses the passed in UserDocument to call jwt.sign', () => {
      const returnValue = UserServiceHelper.createJwt(testUserDoc);
      
      expect(jwt.sign).toHaveBeenCalledWith({
        email: 'EMAIL',
        id: 'ID',
        name: 'NAME',
        picture: 'PICTURE'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
      );
      expect(returnValue).toBe('JWT');
    });
  });

  describe('refreshJwt', () => {
    it('uses the passed in JWT to call jwt.sign', () => {
      const returnValue = UserServiceHelper.refreshJwt(testJwt);

      expect(jwt.sign).toHaveBeenCalledWith({
        email: 'EMAIL',
        id: 'ID',
        name: 'NAME',
        picture: 'PICTURE'
      },
        JWT_SECRET,
        { expiresIn: '15m' }
      );
      expect(returnValue).toBe('JWT');
    });
  });

  describe('isValidEmail', () => {
    beforeEach(() => {
      User.exists = jest.fn().mockReturnValue(Promise.resolve(false));
    });

    it('returns true for valid emails', async () => {
      const validEmails = [
        'test@test.com',
        'user1@test.edu',
        'user.1a@test.co.uk',
        'user+quantifier@test.net'
      ];

      for (let i = 0; i < validEmails.length; i++) {
        expect(await UserServiceHelper.isValidEmail(validEmails[i])).toBe(true);
      }
    });

    it('returns false for invalid emails', async () => {
      const invalidEmails = [
        'test',
        'test@user',
        'test@google.longerThan5Characters',
        'test@google.s'
      ];

      for (let i = 0; i < invalidEmails.length; i++) {
        expect(await UserServiceHelper.isValidEmail(invalidEmails[i])).toBe(false);
      }
    });
  });

  describe('isValidPassword', () => {
    it('returns true when for valid passwords', () => {
      const validPasswords = [
        'lowercaseUPPERCASE1#',
        'passWORD56!',
        'passWORD56@',
        'passWORD56$',
        'passWORD56%',
        'passWORD56^',
        'passWORD56&',
        'passWORD56*'
      ];

      for (let i = 0; i < validPasswords.length; i++) {
        expect(UserServiceHelper.isValidPassword(validPasswords[i])).toBe(true);
      }
    });

    it('returns false for invalid passwords', () => {
      const invalidPasswords = [
        's1#',
        'alllowercase',
        'ALLUPPERCASE',
        '!@#$%^&*'
      ];

      for (let i = 0; i < invalidPasswords.length; i++) {
        expect(UserServiceHelper.isValidPassword(invalidPasswords[i])).toBe(false);
      }
    });
  });

  describe('buildUserForLog', () => {
    it('uses the userDocument to build the response if it is truthy', () => {
      const returnValue = UserServiceHelper.buildUserForLog({ userDocument: testUserDoc });

      expect(returnValue).toEqual({
        id: 'ID',
        email: 'EMAIL',
        profile: {
          name: 'NAME',
          picture: 'PICTURE'
        }
      });
    });

    it('uses the JWT to build the response if it is truthy and the userDocument is falsy', () => {
      const returnValue = UserServiceHelper.buildUserForLog({ jwt: testJwt });

      expect(returnValue).toEqual({
        id: 'ID',
        email: 'EMAIL',
        profile: {
          name: 'NAME'
        }
      });
    });

    it('returns undefined if both the userDocument and JWT are falsy', () => {
      expect(UserServiceHelper.buildUserForLog({})).toBeUndefined();
    });
  });
});
