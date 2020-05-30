import express from 'express';
import { Request, Response } from 'express';
import { AuthenticationBody } from '../types/authentication-body';
import { User, UserDocument } from '../models/User';
import { RegisterBody } from '../types/register-body';
import { isValidEmail, isValidPassword, createJwt } from './auth.helper';
import { isAuthorized } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/authenticate', (req: Request, res: Response) => {
  const auth: AuthenticationBody = req.body;
  
  if (!auth.username || !auth.password) {
    return res.sendStatus(401);
  }

  User.findOne({ email: auth.username }, (err, user) => {
    if (err) {
      return res.sendStatus(500);
    } else {
      user.comparePassword(auth.password, (err, isMatch) => {
        if (err) {
          return res.sendStatus(500);
        } else if (!isMatch) {
          return res.sendStatus(401);
        } else {
          const token = createJwt(user);
          res.cookie('Authorization', `Bearer ${token}`);
          return res.sendStatus(200);
        }
      });
    }
  });
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
      res.cookie('Authorization', `Bearer ${token}`);
      return res.sendStatus(200);
    } catch (e) {
      return res.sendStatus(500);
    }
  } else {
    return res.sendStatus(400);
  }
});

router.get('/test', isAuthorized, (req, res: Response) => res.sendStatus(200));

export default router;