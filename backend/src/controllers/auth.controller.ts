import express from 'express';
import { Request, Response } from 'express';
import { isAuthorized } from '../middleware/auth.middleware';
import { UserService } from '../services/users/user.service';

const router = express.Router();

router.post('/authenticate', async (req: Request, res: Response) => {
  try {
    const jwt = await UserService.authenticate(req);
    res.status(200).send({ jwt });
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const jwt = await UserService.register(req);
    res.status(200).send({ jwt });
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.get('/refresh', isAuthorized, (req: Request, res: Response) => {
  try {
    const jwt = UserService.refresh(req);
    res.status(200).send({ jwt });
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

export default router;
