import app from './app';

export const server = app.listen(app.get('port'), () => console.log('App is running on port: ' + app.get('port')));