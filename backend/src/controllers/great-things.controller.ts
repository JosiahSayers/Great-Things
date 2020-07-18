import express from 'express';
import { Request, Response } from 'express';
import { doesUserOwnGreatThing } from '../middleware/auth.middleware';
import { validateQueryParams, validateQueryParamsForRandom } from '../middleware/great-things-query.middleware';
import { pictureService } from '../services/pictures/picture.service';
import { greatThingService } from '../services/great-things/great-things.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const greatThing = await greatThingService.create(req);
    return res.status(201).send(greatThing);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.delete('/:greatThingId', doesUserOwnGreatThing, async (req: Request, res: Response) => {
  try {
    await greatThingService.remove(req);
    return res.sendStatus(204);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.put('/:greatThingId', doesUserOwnGreatThing, async (req: Request, res: Response) => {
  try {
    await greatThingService.update(req);
    return res.sendStatus(204);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.get('/', validateQueryParams, async (req: Request, res: Response) => {
  try {
    const searchResults = await greatThingService.retrieve(req, false);
    return res.status(200).send(searchResults);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.get('/random', validateQueryParamsForRandom, async (req: Request, res: Response) => {
  try {
    const randomResults = await greatThingService.retrieve(req, true);
    return res.status(200).send(randomResults);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

router.post('/upload-image', async (req: Request, res: Response) => {
  try {
    const picture = await pictureService.uploadImage(req);
    return res.status(200).send(picture);
  } catch (e) {
    return res.sendStatus(parseInt(e.message, 10));
  }
});

export default router;
