import { mocked } from 'ts-jest/utils';
import { logger } from '../../util/logger';
import { User, UserDocument } from '../../models/User';
import { UserService } from './user.service';
import { UserServiceHelper as helper } from './user-helper.service';
import { RegisterBody } from '../../types/register-body';
import { pictureService } from '../pictures/picture.service';
import { GreatThing } from '../../models/Great-Thing';
import { Picture } from '../../models/Picture';
import archiver from 'archiver';
jest.mock('archiver');

describe('UserService', () => {
  const archiverMock = mocked(archiver, true);
  const mockedArchiveObject = {
    append: jest.fn()
  };
  const mockedCreatReadStream = jest.fn().mockReturnValue('READ STREAM');
  const mockedPhotoStorage = {
    file: jest.fn().mockReturnValue({ createReadStream: mockedCreatReadStream })
  };

  beforeEach(() => {
    logger.info = jest.fn();
    logger.debug = jest.fn();
    logger.error = jest.fn();
    helper.buildUserForLog = jest.fn().mockReturnValue('USER_FOR_LOG');
    helper.createJwt = jest.fn().mockReturnValue('JWT');
    pictureService.findById = jest.fn().mockResolvedValue({ href: 'HREF' });
    archiverMock.mockReturnValue(<any>mockedArchiveObject);
  });

  afterEach(() => {
    archiverMock.mockReset();
    mockedArchiveObject.append.mockReset();
  });

  describe('authenticate', () => {
    beforeEach(() => User.findOne = jest.fn().mockReturnValue(Promise.resolve(mockUser({}))));

    it('throws an error when the username or password is falsy', async () => {
      try {
        await UserService.authenticate(<any>{ body: '' });
        expect(false).toBe(true);
      } catch (e) {
        expect(e.message).toBe('401');
      }
    });

    it('throws an error when the user can\'t be found in the database', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      try {
        await UserService.authenticate(<any>{ body: { username: 'USERNAME', password: 'PASSWORD' } });
        expect(false).toBe(true);
      } catch (e) {
        expect(e.message).toBe('401');
      }
    });

    describe('when password verification succeeds', () => {
      let foundUser: UserDocument;

      beforeEach(() => {
        foundUser = mockUser({
          email: 'EMAIL',
          password: 'PASSWORD',
          profile: {
            pictureId: 'PICTURE ID',
            name: ''
          }
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
        expect(helper.createJwt).toHaveBeenCalledWith(foundUser, { href: 'HREF' });
      });
    });

    describe('when password verification fails', () => {
      let foundUser: UserDocument;

      beforeEach(() => {
        foundUser = mockUser({
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
        } catch (e) {
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
        User.findOne = jest.fn().mockImplementation(() => { throw testError; });

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

  describe('register', () => {
    let createdUser: UserDocument;

    beforeEach(() => {
      createdUser = mockUser({
        email: 'EMAIL',
        profile: {
          name: 'NAME',
          pictureId: 'PICTURE'
        }
      });
      User.prototype.save = jest.spyOn(User.prototype, 'save').mockResolvedValue(createdUser);
      helper.isValidEmail = jest.fn().mockResolvedValue(true);
      helper.isValidPassword = jest.fn().mockReturnValue(true);
    });

    it('calls helper functions to determine if the email and password is valid', async () => {
      await UserService.register(mockReq({
        username: 'USERNAME',
        password: 'PASSWORD'
      }));

      expect(helper.isValidEmail).toHaveBeenCalledWith('USERNAME');
      expect(helper.isValidPassword).toHaveBeenCalledWith('PASSWORD');
    });

    it('throws an error if the email is invalid', async () => {
      helper.isValidEmail = jest.fn().mockResolvedValue(false);

      try {
        await UserService.register(mockReq({}));
        expect(false).toBe(true);
      } catch (e) {
        expect(e.message).toBe('400');
      }
    });

    it('logs a debug message if the email or password is invalid', async () => {
      helper.isValidPassword = jest.fn().mockReturnValue(false);
      try {
        await UserService.register(mockReq({ username: 'USERNAME' }));
      } catch { }

      expect(logger.debug).toHaveBeenCalledWith({
        msg: 'User tried to register with an invalid email or password',
        registration: {
          email: 'USERNAME'
        },
        transactionId: 'TRANSACTION_ID'
      });
    });

    it('throws an error if the password is invalid', async () => {
      helper.isValidPassword = jest.fn().mockReturnValue(false);

      try {
        await UserService.register(mockReq({}));
      } catch (e) {
        expect(e.message).toBe('400');
      }
    });

    it('saves a new user to the database if the email and password are valid', async () => {
      await UserService.register(mockReq({
        username: 'USERNAME',
        password: 'PASSWORD',
        name: 'NAME',
        pictureId: 'PICTURE'
      }));

      expect(User.prototype.save).toHaveBeenCalledWith();
    });

    it('creates a new jwt for the user and returns it', async () => {
      const returnValue = await UserService.register(mockReq({}));
      expect(helper.createJwt).toHaveBeenCalledWith(createdUser);
      expect(returnValue).toBe('JWT');
    });

    it('logs an info message when a new user is registered', async () => {
      await UserService.register(mockReq({}));
      expect(helper.buildUserForLog).toHaveBeenCalledWith({ userDocument: createdUser });
      expect(logger.info).toHaveBeenCalledWith({
        msg: 'User successfully registered',
        registration: 'USER_FOR_LOG',
        transactionId: 'TRANSACTION_ID'
      });
    });

    it('logs an error message if an unhandled exception occurs', async () => {
      const testError = new Error('TEST_ERROR');
      helper.isValidPassword = jest.fn().mockImplementation(() => { throw testError; });

      try {
        await UserService.register(mockReq({
          username: 'EMAIL',
          name: 'NAME',
          pictureId: 'PICTURE ID'
        }));
      } catch (e) {
        expect(e.message).toBe('500');
      }

      expect(logger.error).toHaveBeenCalledWith({
        msg: 'User tried to register with the following information:',
        registration: {
          email: 'EMAIL',
          profile: {
            name: 'NAME',
            pictureId: 'PICTURE ID'
          }
        },
        error: testError,
        transactionId: 'TRANSACTION_ID'
      });
    });
  });

  describe('refresh', () => {
    let userSpy: jest.SpyInstance;
    let pictureSpy: jest.SpyInstance;
    const testUser = mockUser({
      profile: {
        pictureId: 'PICTURE ID',
        name: ''
      }
    });
    const testPicture = { href: 'HREF' };

    beforeEach(() => {
      userSpy = jest.spyOn(User, 'findById').mockResolvedValue(testUser);
      pictureSpy = jest.spyOn(pictureService, 'findById').mockResolvedValue(<any>testPicture);
    });

    it('fetches the latest user document from the database', async () => {
      await UserService.refresh(mockReq({}));
      expect(userSpy).toHaveBeenCalledWith(mockReq({}).jwt.id);
    });

    it('fetches the latest picture document from the database if the user has one', async () => {
      await UserService.refresh(mockReq({}));
      expect(pictureSpy).toHaveBeenCalledWith('PICTURE ID');
    });

    it('passes the two retrieved documents to helper.createJwt and returns that return value', async () => {
      const returnValue = await UserService.refresh(mockReq({}));
      expect(returnValue).toBe('JWT');
      expect(helper.createJwt).toHaveBeenCalledWith(testUser, testPicture);
    });

    it('logs an info message after a successful refresh', async () => {
      await UserService.refresh(mockReq({}));

      expect(helper.buildUserForLog).toHaveBeenCalledWith({ jwt: mockReq({}).jwt });
      expect(logger.info).toHaveBeenCalledWith({
        msg: 'User successfully refreshed their JWT',
        transactionId: 'TRANSACTION_ID',
        user: 'USER_FOR_LOG'
      });
    });

    it('logs and error message and throws a 500 error when an uncaught exception occurs', async () => {
      const testError = new Error('TEST');
      User.findById = jest.fn().mockImplementation(() => { throw testError; });
      try {
        await UserService.refresh(mockReq({}));
      } catch (e) {
        expect(e.message).toBe('500');
      }

      expect(helper.buildUserForLog).toHaveBeenCalledWith({ jwt: mockReq({}).jwt });
      expect(logger.error).toHaveBeenCalledWith({
        msg: 'User encountered an error while refreshing their JWT',
        transactionId: 'TRANSACTION_ID',
        user: 'USER_FOR_LOG',
        error: testError
      });
    });
  });

  describe('aggregateAllData', () => {
    beforeEach(() => {
      GreatThing.find = jest.fn().mockResolvedValue([]);
      Picture.find = jest.fn().mockResolvedValue([]);
      User.findById = jest.fn().mockResolvedValue(mockUser({}));
    });

    it('creates a new archiver zip object', async () => {
      await UserService.aggregateAllData(mockReq({}));
      expect(archiverMock).toHaveBeenCalledWith('zip');
    });

    it('finds all of a users great things', async () => {
      await UserService.aggregateAllData(mockReq({}));
      expect(GreatThing.find).toHaveBeenCalledWith({ ownerId: 'JWT_ID' });
    });

    it('finds all of a users pictures', async () => {
      await UserService.aggregateAllData(mockReq({}));
      expect(Picture.find).toHaveBeenCalledWith({ ownerId: 'JWT_ID' });
    });

    it('retrieves the user document from the db', async () => {
      await UserService.aggregateAllData(mockReq({}));
      expect(User.findById).toHaveBeenCalledWith('JWT_ID');
    });

    it('converts the user document to an object, removes the password, and appends it to the archive', async () => {
      await UserService.aggregateAllData(mockReq({}));
      const expectedUser = mockUser({}).toObject();
      delete expectedUser.password;
      expect(mockedArchiveObject.append).toHaveBeenCalledWith(JSON.stringify(expectedUser), { name: 'profile/data.json' });
    });

    it('loops through the found great things and appends them to the archive', async () => {
      const testGreatThings = [
        {
          id: 'ID',
          createdAt: new Date('01/01/2000').toUTCString()
        },
        {
          id: 'ID_2',
          createdAt: new Date('06/22/2005').toUTCString()
        }
      ];
      GreatThing.find = jest.fn().mockResolvedValue(testGreatThings);
      await UserService.aggregateAllData(mockReq({}));
      expect(mockedArchiveObject.append).toHaveBeenCalledWith(JSON.stringify(testGreatThings[0]), { name: 'great-things/2000/1/1/ID.json' });
      expect(mockedArchiveObject.append).toHaveBeenCalledWith(JSON.stringify(testGreatThings[1]), { name: 'great-things/2005/6/22/ID_2.json' });
    });

    it('loops through the found pictures, creates a read stream and appends it to the archive', async () => {
      const pictures = [
        {
          href: 'https://photostorage.com/ID_1',
          format: 'FORMAT',
          createdAt: new Date('01/01/2000').toUTCString()
        },
        {
          href: 'https://photostorage.com/ID_2',
          format: 'FORMAT',
          createdAt: new Date('06/22/2005').toUTCString()
        }
      ];
      Picture.find = jest.fn().mockResolvedValue(pictures);
      await UserService.aggregateAllData(mockReq({}));
      expect(mockedArchiveObject.append).toHaveBeenCalledWith('READ STREAM', { name: 'photos/2000/1/1/ID_1'});
      expect(mockedArchiveObject.append).toHaveBeenCalledWith('READ STREAM', { name: 'photos/2005/6/22/ID_2' });
    });

    it('appends the user profile picture to the profile folder instead of the photos folder', async () => {
      User.findById = jest.fn().mockResolvedValue(mockUser({
        profile: {
          pictureId: 'PROFILE_PICTURE_ID',
          name: ''
        }
      }));

      const pictures = [
        {
          id: 'PROFILE_PICTURE_ID',
          href: 'https://photostorage.com/ID_1',
          format: 'FORMAT',
          createdAt: new Date('01/01/2000').toUTCString()
        }
      ];
      Picture.find = jest.fn().mockResolvedValue(pictures);
      await UserService.aggregateAllData(mockReq({}));
      expect(mockedArchiveObject.append).toHaveBeenCalledWith('READ STREAM', { name: 'profile/user-image.FORMAT' });
    });

    it('returns the archive object', async () => {
      const returnValue = await UserService.aggregateAllData(mockReq({}));
      expect(returnValue).toBe(mockedArchiveObject);
    });
  });


  function mockReq(values: Partial<RegisterBody>): any {
    return <any>{
      body: {
        username: values.username || '',
        password: values.password || '',
        name: values.name || '',
        pictureId: values.pictureId || ''
      },
      headers: {
        'transaction-id': 'TRANSACTION_ID'
      },
      jwt: {
        id: 'JWT_ID'
      },
      photoStorage: mockedPhotoStorage
    };
  }

  function mockUser(userDetails: Partial<UserDocument>, comparePasswordReturnValue?: boolean): UserDocument {
    return <any>{
      comparePassword: () => comparePasswordReturnValue,
      email: userDetails.email || '',
      password: userDetails.password || '',
      profile: {
        name: userDetails.profile?.name || '',
        pictureId: userDetails.profile?.pictureId || ''
      },
      toObject: function () { return this; }
    };
  }

});
