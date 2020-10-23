import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { HomeComponent } from '@src/app/home/home.component';
import { SharedServicesModule } from '@src/app/shared/services/shared-services.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GreatThingsInterceptorService } from '@src/app/shared/interceptors/great-things.interceptor';
import { ComponentsModule } from '@src/app/shared/components/components.module';
import { AuthenticationModule } from '@src/app/authentication/authentication.module';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeGuard } from '@src/app/home/home.guard';
import { sidelogConfigInjectionToken } from 'sidelog-angular';
import { environment } from '@src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
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
    },
    HomeGuard,
    { provide: sidelogConfigInjectionToken, useValue: environment.SIDELOG_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
