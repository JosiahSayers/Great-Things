import app from './app';
import { logger } from './util/logger';

export const server = app.listen(app.get('port'), () => 
  logger.info('App is running on port: ' + app.get('port')));
