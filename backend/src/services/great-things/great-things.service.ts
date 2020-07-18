import { Request } from 'express';
import { GreatThingResponse, MappedResponseObject } from '../../types/great-thing-response';
import { GreatThingRequest } from '../../types/great-things.request';
import { baseLogObject, logger } from '../../util/logger';
import { greatThingsServiceHelper as helper } from './great-things-helper.service';
import { Picture, PictureDocument } from '../../models/Picture';
import { GreatThing, GreatThingDocument } from '../../models/Great-Thing';
import { pictureService } from '../pictures/picture.service';

const create = async (req: Request): Promise<MappedResponseObject | GreatThingResponse> => {
  const gtReq = <GreatThingRequest>req.body;
  const currentTime = new Date().getTime();
  let picture: PictureDocument;

  try {
    if (!gtReq || !gtReq.text) {
      logger.debug({
        msg: 'User tried to create a new Great Thing with invalid input(s)',
        request: req.body,
        ...baseLogObject(req)
      });
      throw new Error('400');
    } else if (gtReq.pictureId) {
      picture = await pictureService.findById(gtReq.pictureId);
      helper.userOwnsPicture(req, picture);
    }

    const greatThing = await new GreatThing(<GreatThingDocument>{
      text: gtReq.text,
      createdAt: currentTime,
      lastUpdatedAt: currentTime,
      ownerId: req.jwt.id,
      pictureId: gtReq.pictureId
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

const update = async (req: Request): Promise<void> => {
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

    return;
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

const retrieve = (req: Request): Promise<GreatThingResponse> => {
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
};

export const greatThingService = {
  create,
  remove,
  update
};
