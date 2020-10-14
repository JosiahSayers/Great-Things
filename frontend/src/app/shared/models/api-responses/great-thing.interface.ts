export interface GreatThingsResponse {
  greatThings: GreatThingFromApi[];
}

export interface GreatThingFromApi {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  picture?: GreatThingsPictureFromApi;
}

export interface GreatThingsPictureFromApi {
  id: string;
  ownerId: string;
  createdAt: string;
  href: string;
  height: number;
  width: number;
  format: string;
}
