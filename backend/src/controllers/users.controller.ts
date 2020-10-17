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

router.get('/all-data', async (req: Request, res: Response) => {
  try {
    const downloadArchive = await UserService.aggregateAllData(req);
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename=${req.jwt.name?.replace(/ /g, '_')}-Great_Things_Data_Download-${new Date().toDateString().replace(/ /g, '_')}.zip`);
    res.set('Access-Control-Expose-Headers', 'Content-Disposition');
    downloadArchive.pipe(res);
    return await downloadArchive.finalize();
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
});

export default router;
