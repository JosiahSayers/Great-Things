import express from 'express';
import { Request, Response } from 'express';
import { GreatThing, GreatThingDocument} from '../models/Great-Thing';
import { NewGreatThingRequest } from '../types/new-great-things.request';
import logger from '../util/logger';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const gtReq: NewGreatThingRequest = req.body;

  if (gtReq && gtReq.text && gtReq.text.length > 0) {
    try {
      const greatThing = await new GreatThing(<GreatThingDocument>{
        text: gtReq.text,
        creationDate: new Date().getTime(),
        ownerId: req.params.userid
      }).save();
      res.status(201).send(greatThing);
    } catch (e) {
      logger.error(e);
      return res.sendStatus(500);
    }
  } else {
    return res.sendStatus(400);
  }
});

export default router;
