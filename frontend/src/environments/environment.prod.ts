import { SidelogConfig } from 'sidelog-angular';
import { baseEnvironment } from './environment.base';

const BACKEND_BASE = 'https://great-things.herokuapp.com/v1';

const SIDELOG_CONFIG: SidelogConfig = {
  clientId: '3641c8d9-495c-4923-9feb-a4d70ac38d7c',
  postLogUrl: 'https://josiahsayers.mynetgear.com/sidelog/logs',
  timesToRetryFailedApiCalls: 5,
  logToApi: true,
  logToConsole: false
};

export const environment = {
  ...baseEnvironment,
  production: true,
  BACKEND_BASE,
  SIDELOG_CONFIG
};
