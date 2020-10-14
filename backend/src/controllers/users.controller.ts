import express from 'express';
import { Request, Response } from 'express';
import { UserService } from '../services/users/user.service';

const router = express.Router();

router.patch('/', async (req: Request, res: Response) => {
  try {
    const jwt = await UserService.updateUser(req);
    res.status(200).send({ jwt });
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

export default router;
