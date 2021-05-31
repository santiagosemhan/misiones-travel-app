import { MsgService } from './_services/msg.service';
import { ApiService } from './_services/api.service';
import { LugarPage } from './lugar/lugar.page';
import { Component } from '@angular/core';

import { NavController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages = [
    {
      title: 'MENU.HOME',
      url: '/home',
      icon: 'home'
    },
    // {
    //   title: 'MENU.LANGUAGE',
    //   url: '/language',
    //   icon: 'flag'
    // }
  ];

  version = '0.0.1';
  isAuth = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private navController: NavController,
    private barcodeScanner: BarcodeScanner,
    private apiService: ApiService,
    private router: Router,
    private messageService: MsgService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.splashScreen.hide();

      this.deepLinkCheck()

    });
  }

  deepLinkCheck() {
    this.deeplinks.route({
      '/lugar/:id': LugarPage
    }).subscribe(match => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      const goto = `${match.$route}/${match.$args['id']}`
      this.navController.navigateRoot(goto)
      console.log('Successfully matched route', match);
    }, nomatch => {
      // nomatch.$link - the full link data
      console.error('Got a deeplink that didn\'t match', nomatch);
    });
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if (barcodeData.text) {
        let loader = this.messageService.presentLoading('Buscando lugar');

        this.apiService.get(`lugares/${barcodeData.text}`).subscribe(
          (lugar: any) => {

            console.log('lugar', lugar)

            this.router.navigate(['/lugar', lugar.id])
            this.messageService.dismissLoading(loader);
          }, (error) => {
            console.error('error', error)
            this.messageService.presentAlert('No se encontró el lugar');
            this.messageService.dismissLoading(loader);
          }
        );
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }


  logout() {

  }
}
