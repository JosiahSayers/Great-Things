import { PictureDocument } from '../../models/Picture';
import { baseLogObject, logger } from '../../util/logger';
import { Request } from 'express';
import { GreatThingRequest } from '../../types/great-things.request';
import { GreatThingDocument, GreatThingInterface } from '../../models/Great-Thing';
import { GreatThingResponse, MappedResponseObject } from '../../types/great-thing-response';
import { pictureService } from '../pictures/picture.service';

const userOwnsPicture = (req: Request, picture: PictureDocument): boolean => {
  if (!picture) {
    logger.debug({
      msg: 'User tried to add a new Great Thing with a picture that doesn\'t exist',
      pictureId: (<GreatThingRequest>req.body).pictureId || 'Unknown',
      ...baseLogObject(req)
    });
    throw new Error('404');
  } else if (picture.ownerId !== req.jwt.id) {
    logger.debug({
      msg: 'User tried to add a new Great Thing with a picture that doesn\'t belong to them',
      pictureId: (<GreatThingRequest>req.body).pictureId || 'Unknown',
      ...baseLogObject(req)
    });
    throw new Error('401');
  } else {
    return true;
  }
};

const mapResponseWithPicture = async (greatThings: GreatThingDocument | GreatThingDocument[]): Promise<MappedResponseObject | GreatThingResponse> => {
  let mappedResponse: MappedResponseObject | GreatThingResponse;

  if (Array.isArray(greatThings)) {
    mappedResponse = { greatThings: [] };
    for (let i = 0; i < greatThings.length; i++) {
      const greatThing = greatThings[i];
      mappedResponse.greatThings.push(await mapSingleGreatThingResponse(greatThing));
    }
  } else {
    mappedResponse = await mapSingleGreatThingResponse(greatThings);
  }

  return mappedResponse;
};

const mapSingleGreatThingResponse = async (greatThing: GreatThingDocument): Promise<MappedResponseObject> => {
  const mapped: MappedResponseObject = mapGreatThing(greatThing);

  if (greatThing.pictureId) {
    const pic = await pictureService.findById(greatThing.pictureId);

    if (pic && pic.ownerId === greatThing.ownerId) {
      mapped.picture = pictureService.mapPicture(pic);
    }
  }

  return mapped;
};

const mapGreatThing = (gt: GreatThingDocument): GreatThingInterface => ({
  id: gt.id,
  text: gt.text,
  ownerId: gt.ownerId,
  createdAt: gt.createdAt,
  updatedAt: gt.updatedAt
});

const sanitizeSearchString = (search: string): string => {
  return search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const greatThingsServiceHelper = {
  userOwnsPicture,
  mapResponseWithPicture,
  sanitizeSearchString
};
