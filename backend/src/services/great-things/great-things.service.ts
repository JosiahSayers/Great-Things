import { Request } from 'express';
import { GreatThingResponse, MappedResponseObject } from '../../types/great-thing-response';
import { GreatThingRequest } from '../../types/great-things.request';
import { baseLogObject, logger } from '../../util/logger';
import { greatThingsServiceHelper as helper } from './great-things-helper.service';
import { PictureDocument } from '../../models/Picture';
import { GreatThing, GreatThingDocument } from '../../models/Great-Thing';
import { pictureService } from '../pictures/picture.service';
import { MongooseFilterQuery } from 'mongoose';
import { languageService } from '../language-processing/natural-language-processing.service';

const create = async (req: Request): Promise<MappedResponseObject | GreatThingResponse> => {
  const gtReq = <GreatThingRequest>req.body;
  let picture: PictureDocument;

  try {
    if (!gtReq?.text) {
      logger.debug({
        msg: 'User tried to create a new Great Thing with invalid input(s)',
        request: req.body,
        ...baseLogObject(req)
      });
      throw new Error('400');
    } else if (gtReq?.pictureId) {
      picture = await pictureService.findById(gtReq.pictureId);
      helper.userOwnsPicture(req, picture);
    }

    const analysis = await languageService.analyzeSingle(req, gtReq.text);

    const greatThing = await new GreatThing(<GreatThingDocument>{
      text: gtReq.text,
      ownerId: req.jwt.id,
      pictureId: gtReq.pictureId,
      people: analysis.people,
      textWithEntities: analysis.modifiedText
    }).save();

    logger.info({
      msg: 'User successfully created a new Great Thing',
      greatThingId: greatThing._id,
      ...baseLogObject(req)
    });

    return await helper.mapResponseWithPicture(greatThing);
  } catch (e) {
    if (e.message !== '400' || e.message !== '401' || e.message !== '404') {
      logger.error({
        msg: 'User encountered an error while creating a Great Thing',
        error: e,
        ...baseLogObject(req)
      });
      e.message = '500';
    }

    throw e;
  }
};

const remove = async (req: Request): Promise<void> => {
  try {
    const deletedDocument = await GreatThing.findByIdAndDelete({ _id: req.params.greatThingId });

    if (!deletedDocument) {
      throw new Error('404');
    }

    if (deletedDocument.pictureId) {
      await pictureService.deleteImage(deletedDocument.pictureId, req);
    }

    logger.info({
      msg: 'User successfully deleted a Great Thing',
      deletedGreatThingId: deletedDocument._id,
      ...baseLogObject(req)
    });

    return;
  } catch (e) {
    if (e.message !== '404') {
      logger.error({
        msg: 'User encountered an error while deleting a Great Thing',
        error: e,
        greatThingId: req.params.greatThingId,
        ...baseLogObject(req)
      });
      e.message = '500';
    }
    throw e;
  }
};

const update = async (req: Request): Promise<MappedResponseObject> => {
  try {
    const updateReq = <GreatThingRequest>req.body;

    const updatedDocument = await GreatThing.findById(req.params.greatThingId);
    updatedDocument.text = updateReq.text ?? updatedDocument.text;
    updatedDocument.pictureId = updateReq.pictureId ?? updatedDocument.pictureId;
    await updatedDocument.save();

    const response = <MappedResponseObject>await helper.mapResponseWithPicture(updatedDocument);

    logger.info({
      msg: 'User successfully updated a new Great Thing',
      greatThingId: req.params.greatThingId,
      ...baseLogObject(req)
    });

    return response;
  } catch (e) {
    logger.error({
      msg: 'User encountered an error while updating a Great Thing',
      error: e,
      greatThingId: req.params.greatThingId,
      ...baseLogObject(req)
    });
    e.message = '500';
    throw e;
  }
};

const retrieve = async (req: Request, random: boolean): Promise<GreatThingResponse> => {
  return random ? await getRandom(req) : await search(req);
};

const getRandom = async (req: Request): Promise<GreatThingResponse> => {
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
      const mapped = await helper.mapResponseWithPicture(greatThingsList);
      return <GreatThingResponse>mapped;
    } else {
      logger.debug({
        msg: 'User tried to get random Great Thing(s) but they haven\'t created any Great Things yet',
        queryParams: req.query,
        ...baseLogObject(req)
      });

      throw new Error('404');
    }
  } catch (e) {
    if (e.message !== '404') {
      logger.error({
        msg: 'User encoutered an error while trying to retrieve random Great Thing(s)',
        error: e,
        queryParams: req.query,
        ...baseLogObject(req)
      });
      e.message = '500';
    }

    throw e;
  }
};

const search = async (req: Request): Promise<GreatThingResponse> => {
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
    const response = await helper.mapResponseWithPicture(greatThingsList);
    const remainingMatches = totalMatches - greatThingsList.length - ((page - 1) * limit);

    logger.info({
      msg: 'User successfully searched for Great Things',
      queryParams: req.query,
      ...baseLogObject(req)
    });

    return <GreatThingResponse>{ ...response, remainingMatches };
  } catch (e) {
    logger.error({
      msg: 'User encountered an error while trying to search for Great Things',
      error: e,
      queryParams: req.query,
      ...baseLogObject(req)
    });
    e.message = '500';
    throw e;
  }
};

export const greatThingService = {
  create,
  remove,
  update,
  retrieve
};
