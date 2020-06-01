import express from 'express';
import { Request, Response } from 'express';
import { GreatThing, GreatThingDocument} from '../models/Great-Thing';
import { GreatThingRequest } from '../types/great-things.request';
import logger from '../util/logger';
import { doesUserOwnGreatThing } from '../middleware/auth.middleware';
import { validateQueryParams, validateQueryParamsForRandom } from '../middleware/great-things-query.middleware';
import { MongooseFilterQuery } from 'mongoose';

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

router.get('/', validateQueryParams, async (req: Request, res: Response) => {
  const sortBy = <string>req.query['sort-by'];
  const sortOrder = <string>req.query['sort-order'];
  const page = parseInt(<string>req.query['page']);
  const searchText = <string>req.query['search'];
  const limit = parseInt(<string>req.query['limit']);
  const before = parseInt(<string>req.query['before']);
  const after = parseInt(<string>req.query['after']);

  const sortOptions: {[key: string]: string} = {};
  sortOptions[sortBy] = sortOrder;

  const skipValue = (page - 1) * limit;

  try {
    const findObject: MongooseFilterQuery<Pick<GreatThingDocument, string | number>> = { ownerId: req.jwt.id };
    
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

    const totalMatches = await GreatThing.count(query.getQuery()).exec();
    const greatThingsList = await query.limit(limit).exec();
    const remainingMatches = totalMatches - greatThingsList.length - ((page - 1) * limit);
    return res.status(200).send({ greatThings: greatThingsList, remainingMatches });
  } catch (e) {
    logger.error(e);
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

      return res.status(200).send({ greatThings: greatThingsList });
    } else {
      return res.status(404);
    }
  } catch (e) {
    logger.error(e);
    return res.sendStatus(500);
  }
});

export default router;
