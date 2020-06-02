import express from 'express';
import { Request, Response } from 'express';
import { GreatThing, GreatThingDocument} from '../models/Great-Thing';
import { GreatThingRequest } from '../types/great-things.request';
import { logger, baseLogObject } from '../util/logger';
import { doesUserOwnGreatThing } from '../middleware/auth.middleware';
import { validateQueryParams, validateQueryParamsForRandom } from '../middleware/great-things-query.middleware';
import { MongooseFilterQuery } from 'mongoose';
import { upload as uploadImage } from '../util/image-management';
import { validatePicture } from '../middleware/great-things-picture.middleware';

const router = express.Router();

router.post('/', validatePicture, async (req: Request, res: Response) => {
  const gtReq = <GreatThingRequest>req.body;
  const currentTime = new Date().getTime();

  if (gtReq && gtReq.text && gtReq.text.length > 0) {
    try {
      const greatThing = await new GreatThing(<GreatThingDocument>{
        text: gtReq.text,
        createdAt: currentTime,
        lastUpdatedAt: currentTime,
        ownerId: req.jwt.id,
        picture: gtReq.picture
      }).save();

      logger.info({
        msg: 'User successfully created a new Great Thing',
        greatThingId: greatThing._id,
        ...baseLogObject(req)
      });

      res.status(201).send(greatThing);
    } catch (e) {
      logger.error({
        msg: 'User encountered an error while creating a Great Thing',
        error: e,
        ...baseLogObject(req)
      });
      return res.sendStatus(500);
    }
  } else {
    logger.debug({
      msg: 'User tried to create a new Great Thing with invalid input(s)',
      request: req.body,
      ...baseLogObject(req)
    });
    return res.sendStatus(400);
  }
});

router.delete('/:greatThingId', doesUserOwnGreatThing, async (req: Request, res: Response) => {
  try {
    const deletedDocument = await GreatThing.findByIdAndDelete({ _id: req.params.greatThingId });
    
    if (!deletedDocument) {
      return res.sendStatus(404);
    }

    logger.info({
      msg: 'User successfully deleted a Great Thing',
      deletedGreatThingId: deletedDocument._id,
      ...baseLogObject(req)
    });

    return res.sendStatus(204);
  } catch (e) {
    logger.error({
      msg: 'User encountered an error while deleting a Great Thing',
      error: e,
      greatThingId: req.params.greatThingId,
      ...baseLogObject(req)
    });
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

    logger.info({
      msg: 'User successfully updated a new Great Thing',
      greatThingId: req.params.greatThingId,
      ...baseLogObject(req)
    });

    return res.sendStatus(204);
  } catch (e) {
    logger.error({
      msg: 'User encountered an error while updating a Great Thing',
      error: e,
      greatThingId: req.params.greatThingId,
      ...baseLogObject(req)
    });
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
    const remainingMatches = totalMatches - greatThingsList.length - ((page - 1) * limit);

    logger.info({
      msg: 'User successfully searched for Great Things',
      queryParams: req.query,
      ...baseLogObject(req)
    });

    return res.status(200).send({ greatThings: greatThingsList, remainingMatches });
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

      return res.status(200).send({ greatThings: greatThingsList });
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
    if (req.files.image && !Array.isArray(req.files.image)) {
      const picture = await uploadImage(req.files.image);
      return res.status(200).send({ picture });

    } else if (Array.isArray(req.files.image)) {
      logger.debug({
        msg: 'User tried to upload multiple files',
        ...baseLogObject(req)
      });

    } else {
      logger.debug({
        msg: 'User tried to upload a file without sending it in the "image" form field',
        ...baseLogObject(req)
      });
    }
  } catch (e) {
    logger.error({
      msg: 'User encountered an error while trying to upload an image',
      error: e,
      ...baseLogObject(req)
    });
    return res.sendStatus(500);
  }
});

export default router;
