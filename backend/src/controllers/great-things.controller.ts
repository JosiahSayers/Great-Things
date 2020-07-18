import express from 'express';
import { Request, Response } from 'express';
import { GreatThing, GreatThingDocument } from '../models/Great-Thing';
import { logger, baseLogObject } from '../util/logger';
import { doesUserOwnGreatThing } from '../middleware/auth.middleware';
import { validateQueryParams, validateQueryParamsForRandom } from '../middleware/great-things-query.middleware';
import { MongooseFilterQuery } from 'mongoose';
import { mapResponseWithPicture } from './great-things.controller.helper';
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
  const sortBy = <string>req.query['sort-by'];
  const sortOrder = <string>req.query['sort-order'];
  const page = parseInt(<string>req.query['page']);
  const searchText = <string>req.query['search'];
  const limit = parseInt(<string>req.query['limit']);
  const before = parseInt(<string>req.query['before']);
  const after = parseInt(<string>req.query['after']);

  const sortOptions: { [key: string]: string } = {};
  sortOptions[sortBy] = sortOrder;

  const skipValue = (page - 1) * limit;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findObject: MongooseFilterQuery<Pick<GreatThingDocument, any>> = { ownerId: req.jwt.id };

    if (searchText) {
      const searchString = `\\Q${searchText}\\E`;
      findObject.text = { $regex: searchString, $options: 'i' };
    }

    const query = GreatThing
      .find(findObject)
      .sort(sortOptions)
      .skip(skipValue);

    if (before) {
      query.lt('createdAt', before);
    }

    if (after) {
      query.gt('createdAt', after);
    }

    const totalMatches = await GreatThing.countDocuments(query.getQuery()).exec();
    const greatThingsList = await query.limit(limit).exec();
    const response = await mapResponseWithPicture(greatThingsList);
    const remainingMatches = totalMatches - greatThingsList.length - ((page - 1) * limit);

    logger.info({
      msg: 'User successfully searched for Great Things',
      queryParams: req.query,
      ...baseLogObject(req)
    });

    return res.status(200).send({ ...response, remainingMatches });
  } catch (e) {
    logger.error({
      msg: 'User encountered an error while trying to search for Great Things',
      error: e,
      queryParams: req.query,
      ...baseLogObject(req)
    });
    return res.sendStatus(500);
  }
});

router.get('/random', validateQueryParamsForRandom, async (req: Request, res: Response) => {
  const limit = parseInt(<string>req.query['limit']);

  try {
    const userGreatThingCount = await GreatThing.find({ ownerId: req.jwt.id }).countDocuments().exec();

    if (userGreatThingCount > 0) {
      const greatThingsList: GreatThingDocument[] = [];
      for (let i = 0; i < limit; i++) {
        const randomSkip = Math.floor(Math.random() * userGreatThingCount);
        greatThingsList.push(
          await GreatThing
            .findOne({ ownerId: req.jwt.id })
            .skip(randomSkip)
            .exec()
        );
      }

      logger.info({
        msg: 'User successfully retrieved random Great Thing(s)',
        queryParams: req.query,
        ...baseLogObject(req)
      });

      return res.status(200).send(await mapResponseWithPicture(greatThingsList));
    } else {
      logger.debug({
        msg: 'User tried to get random Great Thing(s) but they haven\'t created any Great Things yet',
        queryParams: req.query,
        ...baseLogObject(req)
      });

      return res.status(404);
    }
  } catch (e) {
    logger.error({
      msg: 'User encoutered an error while trying to retrieve random Great Thing(s)',
      error: e,
      queryParams: req.query,
      ...baseLogObject(req)
    });
    return res.sendStatus(500);
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
