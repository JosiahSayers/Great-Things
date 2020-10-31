import { SidelogConfig } from 'sidelog-angular';

const production = false;

// const BACKEND_BASE = 'http://localhost:3000/v1';
const BACKEND_BASE = 'https://great-things-test.herokuapp.com/v1';

const SIDELOG_CONFIG: SidelogConfig = {
  clientId: 'test',
  postLogUrl: '',
  timesToRetryFailedApiCalls: 5,
  logToApi: false,
  logToConsole: true
};

const RANDOM_QUOTE_URL = 'http://quotes.stormconsultancy.co.uk/random.json';

export const baseEnvironment = {
  production,
  BACKEND_BASE,
  SIDELOG_CONFIG,
  RANDOM_QUOTE_URL
};
