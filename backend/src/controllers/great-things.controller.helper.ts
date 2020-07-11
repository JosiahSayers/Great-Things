import { GreatThingDocument, mapGreatThing } from '../models/Great-Thing';
import { Picture } from '../models/Picture';
import { GreatThingResponse, MappedResponseObject } from '../types/great-thing-response';

export const sanitizeSearchString = (search: string): string => {
  return search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export const mapResponseWithPicture = async (greatThings: GreatThingDocument[]): Promise<GreatThingResponse> => {
  const mappedResponse: GreatThingResponse = { greatThings: [] };

  for (let i = 0; i < greatThings.length; i++) {
    const greatThing = greatThings[i];

    const mapped: MappedResponseObject = mapGreatThing(greatThing);

    if (greatThing.pictureId) {
      const pic = await Picture.findById(greatThing.pictureId);

      if (pic && pic.ownerId === greatThing.ownerId) {
        mapped.picture = {
          ownerId: pic.ownerId,
          createdAt: pic.createdAt,
          href: pic.href,
          height: pic.height,
          width: pic.width,
          format: pic.format
        };
      }
    }
    mappedResponse.greatThings.push(mapped);
  }

  return mappedResponse;
};
