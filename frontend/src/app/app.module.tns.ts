import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule, NativeScriptRouterModule } from '@nativescript/angular';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module.tns';
import { AuthenticationModule } from '@src/app/authentication/authentication.module.tns';
import { HomeGuard } from '@src/app/home/home.guard';
import { GreatThingsTilesComponent } from '@src/app/great-things-tiles/great-things-tiles.component';
import { FileUploadComponent } from '@src/app/file-upload/file-upload.component';


// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
// import { NativeScriptFormsModule, NativeScriptHttpClientModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GreatThingsTilesComponent,
    FileUploadComponent,
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    SharedServicesModule,
    AuthenticationModule,
    NativeScriptRouterModule
  ],
  providers: [
    HomeGuard
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
