import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { MsgService } from './_services/msg.service';
import { ApiService } from './_services/api.service';
import { MapboxService } from './_services/mapbox.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateFnsConfigurationService, DateFnsModule } from 'ngx-date-fns';
import { es } from 'date-fns/locale';
import { MarkdownModule } from 'ngx-markdown';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

const frenchConfig = new DateFnsConfigurationService();
frenchConfig.setLocale(es);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      defaultLanguage: 'es'
    }),
    IonicStorageModule.forRoot({
      name: '__misiones-travel-app',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    BrowserAnimationsModule,
    DateFnsModule.forRoot(),
    MarkdownModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MapboxService,
    ApiService, 
    MsgService,
    Deeplinks,
    Geolocation,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: DateFnsConfigurationService, useValue: frenchConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
