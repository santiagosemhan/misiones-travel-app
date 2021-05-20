import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements AfterViewInit {

  @ViewChild('drawer', { read: ElementRef }) drawer: ElementRef;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();
  @Output('btnClick') btnClick: EventEmitter<boolean> = new EventEmitter();
  @Output('btnRoute') btnRoute: EventEmitter<boolean> = new EventEmitter();
  // @Input() categorias;
  isOpen = false;
  openHeight = 0;



  constructor(private platform: Platform, private gestureCtrl: GestureController) {


  }

  async ngAfterViewInit() {

    const drawer = this.drawer.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 30;
    // console.log('openHeight', this.openHeight)
    const gesture = await this.gestureCtrl.create({
      el: drawer,
      gestureName: 'swipe',
      direction: 'y',
      onStart: () => {
        drawer.style.transition = 'none';
      },
      onMove: evt => {
        // console.log('onMove', evt)
        if (evt.deltaY < -this.openHeight) {
          return;
        }
        drawer.style.transform = `translateY(${evt.deltaY}px)`

      },
      onEnd: evt => {
        // console.log('onEnd', evt)
        if (evt.deltaY < -30 && !this.isOpen) {
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isOpen = true;
        }
        else if (evt.deltaY > 30 && this.isOpen) {
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = '';
          this.openState.emit(false);
          this.isOpen = false;
        }
      }
    });
    gesture.enable(true);
  }

  toggleDrawer() {
    const drawer = this.drawer.nativeElement;
    this.openState.emit(!this.isOpen);

    if (!this.isOpen) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = '';
      this.isOpen = false;
    } else {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${-this.openHeight}px)`;
      this.isOpen = true;
    }
  }

  isCategoriaDisabled(categoria) {
    // let cat = this.categorias.filter(function (iCat) {
    //   return iCat.slug === categoria;
    // })[0]

    // return !cat.activo;

  }

  btnCategoria(categoria) {
    this.btnClick.emit(categoria);
  }

  goTo(path) {
    this.btnRoute.emit(path);
  }
}
