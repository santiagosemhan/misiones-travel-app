import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  loader: any;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController

  ) {

  }


  /**
   * 
   * @param msg Mensaje que se va a mostror en el atributo
   * @param attrs atributos extras
   */
  async presentToast(msg, attrs?) {

    let obj = {
      message: msg
    }

    if (!attrs) {
      attrs = {
        duration: 2000
      }
    }

    if (!attrs.duration) {
      attrs.duration = 2000
    }

    obj = Object.assign({}, obj, attrs);
    const toast = await this.toastCtrl.create(obj);
    toast.present();

    return toast
  }

  async presentAlert(msg, className?) {
    const alert = await this.alertCtrl.create({
      message: msg,
      cssClass: className,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  async presentLoading(msg?) {
    if (!msg) {
      msg = 'Cargando...'
    }
    const loader = await this.loadingCtrl.create({
      message: msg
    });

    loader.present();

    this.loader = loader;

    return loader;
  }

  dismissLoading(loader?) {
    if (loader) {
      // loader.dismissAll()
      this.loadingCtrl.dismiss(loader)
    } else {
      this.loadingCtrl.dismiss(this.loader)
    }

  }

  async presentConfirm(title, message, sucessFn, cancelFn?, okText?, cancelText?) {
    let alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
        {
          text: cancelText || 'Cancelar',
          role: 'cancel',
          handler: () => {
            if (cancelFn) {
              cancelFn();
            }
            console.log('Cancel clicked');
          }
        },
        {
          text: okText || 'Aceptar',
          handler: () => {
            sucessFn();
            console.log('Aceptar clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
