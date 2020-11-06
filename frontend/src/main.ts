import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@src/app/app.module';
import { environment } from '@src/environments/environment';
import { enableFullStory } from './assets/scripts/full-story';

if (environment.production) {
  enableProdMode();
  enableFullStory();
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
