import express from 'express';
import { Request, Response } from 'express';
import { AuthenticationBody } from '../types/authentication-body';
import { User, UserDocument } from '../models/User';
import { RegisterBody } from '../types/register-body';
import { isValidEmail, isValidPassword, createJwt } from './auth.controller.helper';
import { isAuthorized } from '../middleware/auth.middleware';
import logger from '../util/logger';

const router = express.Router();

router.post('/authenticate', async (req: Request, res: Response) => {
  const auth: AuthenticationBody = req.body;

  if (!auth.username || !auth.password) {
    return res.sendStatus(401);
  }

  try {
    const user = await User.findOne({ email: auth.username });
    const correctPassword = user.comparePassword(auth.password);

    if (correctPassword) {
      const token = createJwt(user);
      res.cookie('Authorization', `Bearer ${token}`, { encode: String });
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
    
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

router.post('/register', async (req: Request, res: Response) => {
  const auth: RegisterBody = req.body;

  if (await isValidEmail(auth.username) && isValidPassword(auth.password)) {
    try {
      const user = await new User(<UserDocument>{
        email: auth.username,
        password: auth.password,
        profile: {
          name: auth.name,
          picture: auth.picture
        }
      }).save();

      const token = createJwt(user);
      res.cookie('Authorization', `Bearer ${token}`, { encode: String });
      return res.sendStatus(200);
    } catch (e) {
      logger.error(e);
      return res.sendStatus(500);
    }
  } else {
    return res.sendStatus(400);
  }
});

router.get('/test/:userid', isAuthorized, (req, res: Response) => res.sendStatus(200));

export default router;
