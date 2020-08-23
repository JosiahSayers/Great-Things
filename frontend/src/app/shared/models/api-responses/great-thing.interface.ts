export interface GreatThingsResponse {
  greatThings: GreatThingFromApi[];
}

export interface GreatThingFromApi {
  id: string;
  text: string;
  createdAt: number;
  lastUpdatedAt: number;
  ownerId: string;
  picture?: GreatThingsPictureFromApi;
}

export interface GreatThingsPictureFromApi {
  id: string;
  ownerId: string;
  createdAt: number;
  href: string;
  height: number;
  width: number;
  format: string;
}
