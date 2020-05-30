import express from 'express';
import { Request, Response } from 'express';
import { GreatThing, GreatThingDocument} from '../models/Great-Thing';
import { GreatThingRequest } from '../types/great-things.request';
import logger from '../util/logger';
import { doesUserOwnGreatThing } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const gtReq = <GreatThingRequest>req.body;
  const currentTime = new Date().getTime();

  if (gtReq && gtReq.text && gtReq.text.length > 0) {
    try {
      const greatThing = await new GreatThing(<GreatThingDocument>{
        text: gtReq.text,
        createdAt: currentTime,
        lastUpdatedAt: currentTime,
        ownerId: req.jwt.id
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

router.delete('/:greatThingId', doesUserOwnGreatThing, async (req: Request, res: Response) => {
  try {
    const deletedDocument = await GreatThing.findByIdAndDelete({ _id: req.params.greatThingId });
    
    if (!deletedDocument) {
      return res.sendStatus(404);
    }

    return res.sendStatus(204);
  } catch (e) {
    return res.sendStatus(500);
  }
});

router.put('/:greatThingId', doesUserOwnGreatThing, async (req: Request, res: Response) => {
  try {
    const updatedGreatThing = <GreatThingRequest>req.body;
    await GreatThing.findByIdAndUpdate({ _id: req.params.greatThingId }, {
      text: updatedGreatThing.text,
      lastUpdatedAt: new Date().getTime()
    });

    return res.sendStatus(204);
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

export default router;
