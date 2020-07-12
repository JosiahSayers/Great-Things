import express from 'express';
import { Request, Response } from 'express';
import { User, UserDocument } from '../models/User';
import { RegisterBody } from '../types/register-body';
import { isAuthorized } from '../middleware/auth.middleware';
import { logger } from '../util/logger';
import { JWT_SECRET } from '../util/environment';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';

const router = express.Router();

router.post('/authenticate', async (req: Request, res: Response) => {
  try {
    const jwt = await UserService.authenticate(req);
    res.cookie('Authorization', `Bearer ${jwt}`, { encode: String });
    res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

// router.post('/register', async (req: Request, res: Response) => {
//   const auth: RegisterBody = req.body;

//   if (await isValidEmail(auth.username) && isValidPassword(auth.password)) {
//     try {
//       const user = await new User(<UserDocument>{
//         email: auth.username,
//         password: auth.password,
//         profile: {
//           name: auth.name,
//           picture: auth.picture
//         }
//       }).save();

//       const token = createJwt(user);
//       res.cookie('Authorization', `Bearer ${token}`, { encode: String });

//       logger.info({
//         msg: 'User successfully registered',
//         registration: buildUserForLog(user),
//         transactionId: <string>req.headers['transaction-id']
//       });

//       return res.sendStatus(200);
//     } catch (e) {
//       logger.error({
//         msg: 'User tried to register with the following information:',
//         registration: {
//           email: auth.username,
//           profile: {
//             name: auth.name,
//             picture: auth.picture
//           }
//         },
//         error: e,
//         transactionId: <string>req.headers['transaction-id']
//       });
//       return res.sendStatus(500);
//     }
//   } else {
//     logger.debug({
//       msg: 'User tried to register with an invalid email or password',
//       registration: {
//         email: auth.username
//       },
//       transactionId: <string>req.headers['transaction-id']
//     });
//     return res.sendStatus(400);
//   }
// });

router.get('/refresh', isAuthorized, async (req: Request, res: Response) => {
  const newJWT = jwt.sign(
    {
      email: req.jwt.email,
      id: req.jwt.id,
      name: req.jwt.name,
      picture: req.jwt.picture
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  logger.info({
    msg: 'User successfully refreshed their JWT',
    transactionId: req.headers['transaction-id'],
    user: {
      id: req.jwt.id,
      email: req.jwt.email,
      profile: {
        name: req.jwt.name
      }
    }
  });

  res.cookie('Authorization', `Bearer ${newJWT}`, { encode: String });
  res.sendStatus(200);
});

router.get('/test/:userid', isAuthorized, (req, res: Response) => res.sendStatus(200));

export default router;
