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

export const baseEnvironment = {
  production,
  BACKEND_BASE,
  SIDELOG_CONFIG
};
