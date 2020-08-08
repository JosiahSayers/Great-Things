import { baseEnvironment } from './environment.base';

const BACKEND_BASE = 'https://great-things-test.herokuapp.com/v1';

export const environment = {
  ...baseEnvironment,
  BACKEND_BASE
};

import 'zone.js/dist/zone-error';
