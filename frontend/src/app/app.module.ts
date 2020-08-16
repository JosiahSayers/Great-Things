import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { SharedServicesModule } from './shared/services/shared-services.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GreatThingsInterceptorService } from './shared/interceptors/great-things.interceptor';
import { ComponentsModule } from './components/components.module';
import { AuthenticationModule } from './authentication/authentication.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedServicesModule,
    HttpClientModule,
    ComponentsModule,
    AuthenticationModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GreatThingsInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
