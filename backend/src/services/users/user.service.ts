import { User, UserDocument } from '../../models/User';
import { AuthenticationBody } from '../../types/authentication-body';
import { UserServiceHelper as helper } from './user-helper.service';
import { logger } from '../../util/logger';
import { Request } from 'express';
import { RegisterBody } from '../../types/register-body';
import { MongoError } from 'mongodb';
import { pictureService } from '../pictures/picture.service';
import { GreatThing } from '../../models/Great-Thing';
import { Picture } from '../../models/Picture';
import archiver from 'archiver';

const authenticate = async (req: Request): Promise<string> => {
  let jwt;
  const auth: AuthenticationBody = req.body;

  if (!auth.username || !auth.password) {
    throw new Error('401');
  }

  try {
    const user = await User.findOne({ email: auth.username });
    let picture;

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

      if (user.profile.pictureId) {
        picture = await pictureService.findById(user.profile.pictureId);
      }

      jwt = helper.createJwt(user, picture);
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
        pictureId: auth.pictureId
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
            pictureId: auth.pictureId
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

const refresh = async (req: Request): Promise<string> => {
  try {
    const user = await User.findById(req.jwt.id);
    let picture;

    if (user.profile.pictureId) {
      picture = await pictureService.findById(user.profile.pictureId);
    }

    logger.info({
      msg: 'User successfully refreshed their JWT',
      transactionId: req.headers['transaction-id'],
      user: helper.buildUserForLog({ jwt: req.jwt })
    });

    return helper.createJwt(user, picture);

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

const updateUser = async (req: Request): Promise<string> => {
  try {
    const currentUser = await User.findById(req.jwt.id);
    let updatedPictureId;

    if (req.body.pictureId === null) {
      updatedPictureId = null;
    } else if (req.body.pictureId === undefined) {
      updatedPictureId = currentUser.profile.pictureId;
    } else {
      updatedPictureId = req.body.pictureId;
    }

    currentUser.email = req.body.email || currentUser.email;
    currentUser.password = req.body.password || currentUser.password;
    currentUser.profile = {
      name: req.body.name || currentUser.profile.name,
      pictureId: updatedPictureId
    };

    const newPicture = await pictureService.findById(updatedPictureId);

    return helper.createJwt(await currentUser.save(), newPicture);
  } catch (e) {
    if (e instanceof MongoError && e.code === 11000) {
      logger.error({
        msg: 'User tried to update their email to an email that already exists in the database',
        user: helper.buildUserForLog({ jwt: req.jwt }),
        error: e
      });
      e.message = '409';
    } else {
      logger.error({
        msg: 'User encountered an error while updating their information',
        user: helper.buildUserForLog({ jwt: req.jwt }),
        error: e
      });
      e.message = '500';
    }

    throw e;
  }
};

const aggregateAllData = async (req: Request): Promise<archiver.Archiver> => {
  const archive = archiver('zip');
  const allGreatThings = await GreatThing.find({ ownerId: req.jwt.id });
  const allPhotos = await Picture.find({ ownerId: req.jwt.id });
  const user = await User.findById(req.jwt.id);

  const userToSend = user.toObject();
  delete userToSend.password;
  archive.append(JSON.stringify(userToSend), { name: 'profile/data.json'});

  for (const greatThing of allGreatThings) {
    const createdAt = new Date(greatThing.createdAt);
    const nameInArchive = `great-things/${createdAt.getUTCFullYear()}/${createdAt.getUTCMonth() + 1}/${createdAt.getUTCDate()}/${greatThing.id}.json`;
    archive.append(JSON.stringify(greatThing), { name: nameInArchive });
  }

  for (const photo of allPhotos) {
    const pathSegments = photo.href.split('/');
    const filename = pathSegments[pathSegments.length - 1];
    const photoStream = req.photoStorage.file(filename).createReadStream();
    
    if (photo.id === user.profile.pictureId) {
      archive.append(photoStream, { name: `profile/user-image.${photo.format}` });
    } else {
      const createdAt = new Date(photo.createdAt);
      const nameInArchive = `photos/${createdAt.getUTCFullYear()}/${createdAt.getUTCMonth() + 1}/${createdAt.getUTCDate()}/${filename}`;
      archive.append(photoStream, { name: nameInArchive });
    }
  }

  return archive;
};

export const UserService = {
  authenticate,
  register,
  refresh,
  updateUser,
  aggregateAllData
};
