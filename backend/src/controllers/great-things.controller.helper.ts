import { GreatThingDocument } from '../models/Great-Thing';

export const generateSuccessResponseBody =
(greatThings: GreatThingDocument | GreatThingDocument[], arrayify?: boolean): GreatThingResponseBody => {
  if (Array.isArray(greatThings) || !arrayify) {
    return { greatThings };
  } else {
    return { greatThings: [greatThings] };
  }
};

export const sanitizeSearchString = (search: string): string => {
  return search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export interface GreatThingResponseBody {
  greatThings: GreatThingDocument | GreatThingDocument[];
}
