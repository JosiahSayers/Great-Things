import { GreatThingDocument, mapGreatThing } from '../models/Great-Thing';
import { GreatThingResponse, MappedResponseObject } from '../types/great-thing-response';
import { PictureService } from '../services/pictures/picture.service';

export const sanitizeSearchString = (search: string): string => {
  return search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const mapResponseWithPicture = async (greatThings: GreatThingDocument[]): Promise<GreatThingResponse> => {
  const mappedResponse: GreatThingResponse = { greatThings: [] };

  for (let i = 0; i < greatThings.length; i++) {
    const greatThing = greatThings[i];

    const mapped: MappedResponseObject = mapGreatThing(greatThing);

    if (greatThing.pictureId) {
      const pic = await PictureService.findById(greatThing.pictureId);

      if (pic && pic.ownerId === greatThing.ownerId) {
        mapped.picture = PictureService.mapPicture(pic);
      }
    }
    mappedResponse.greatThings.push(mapped);
  }

  return mappedResponse;
};
