import { ApiService } from './../../_services/api.service';
import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'mt-drawer-lugar',
  templateUrl: './drawer-lugar.component.html',
  styleUrls: ['./drawer-lugar.component.scss'],
})
export class DrawerLugarComponent implements OnInit {

  @ViewChild('drawerLugar', { read: ElementRef }) drawerLugar: ElementRef;
  @Input() lugar;
  @Output('openStateChnaged') openState: EventEmitter<boolean> = new EventEmitter();
  @Output('btnClick') btnClick: EventEmitter<boolean> = new EventEmitter();

  categorias;
  lugares;
  hoja;
  padre;

  isOpen = false;
  openHeight = 0;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3.2
  };

  // colores
  colores = [
    { 'imperdibles': '#E29000' },
    { 'atracciones': '#29ABE2' },
    { 'circuitos': '#00A89D' },
    { 'alojamiento': '#22B573' },
    { 'gastronomia': '#0071BB' },
    { 'cupones': '#F47621' }
  ]

  // colores


  constructor(private platform: Platform, private gestureCtrl: GestureController,
    private apiService: ApiService) {
  }

  ngOnInit() {

    let color = this.colores.find((element) => {

      return element[this.lugar.slug]
    });

    if (color)
      document.documentElement.style.setProperty('--fondo-drawer', color[this.lugar.slug]);

    // this.loadCategorias()
  }

  // ngOnChanges(changes: SimpleChanges) {

  //   console.log(changes)
  //   // You can also use categoryId.previousValue and 
  //   // categoryId.firstChange for comparing old and new values

  //   if (changes.categoria.currentValue.lugares && changes.categoria.currentValue.lugares.length > 0) {
  //     console.log('tiene lugares')
  //     this.lugares = changes.categoria.currentValue
  //     this.categorias = null;
  //     this.hoja = null;
  //   } else if (changes.categoria.currentValue.localidad) {
  //     console.log('es lugar')
  //     this.lugares = null;
  //     this.categorias = null;
  //     this.hoja = changes.categoria.currentValue;
  //   }

  //   this.padre = changes.categoria.previousValue



  // }

  async loadCategorias() {
    // let params = {
    //   'categoria': this.categoria.id
    // }
    // await this.apiService.get('categorias', params).subscribe(
    //   (categorias) => {
    //     this.categorias = categorias;
    //     this.lugares = null;
    //     console.log('loadCategorias', categorias)
    //   });
  }



  async ngAfterViewInit() {    

    const drawerLugar = this.drawerLugar.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 30;
    // console.log('openHeight', this.openHeight)

    if (this.lugar.descripcion == null || this.lugar.descripcion === "") {
      return;
    }

    const gesture = await this.gestureCtrl.create({
      el: drawerLugar,
      gestureName: 'swipe',
      direction: 'y',
      onMove: evt => {
        // console.log('onMove', evt.deltaY)
        if (evt.deltaY < this.openHeight) {
          return;
        }
        drawerLugar.style.transform = `translateY(${evt.deltaY}px)`

      },
      onEnd: evt => {
        // console.log('onEnd', evt)
        if (evt.deltaY < -30 && !this.isOpen) {
          drawerLugar.style.transition = '.6s ease-out';
          drawerLugar.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isOpen = true;
        } else if (evt.deltaY > 30 && this.isOpen) {
          drawerLugar.style.transition = '.6s ease-out';
          drawerLugar.style.transform = '';
          this.openState.emit(false);
          this.isOpen = false;
        }
      }
    });
    gesture.enable(true);
  }

  toggleDrawer() {

    if (this.lugar.descripcion == null || this.lugar.descripcion === "") {
      return;
    }

    const drawerLugar = this.drawerLugar.nativeElement;
    this.openState.emit(!this.isOpen);

    if (!this.isOpen) {
      drawerLugar.style.transition = '.8s ease-out';
      drawerLugar.style.transform = `translateY(${-this.openHeight}px)`;
    } else {
      drawerLugar.style.transition = '.8s ease-out';
      drawerLugar.style.transform = '';
    }

    this.isOpen = !this.isOpen;
  }

  openImagen(imagen) {
    // this.toggleDrawer()
    const drawerLugar = this.drawerLugar.nativeElement;
    drawerLugar.style.transition = '.8s ease-out';
    drawerLugar.style.transform = '';
    this.btnClick.emit(imagen);
  }

  abrirWeb() {
    window.open(this.lugar.sitio_web, '_system');
  }
  email() {
    window.open(`mailto:${this.lugar.email}`, '_system');
  }
  llamar() {
    window.open(`tel:${this.lugar.telefono}`, '_system');
  }
  comoLlegar() {
    if (this.platform.is('android')) {
      window.location.href = `https://maps.google.com/?q=${this.lugar.geoposicion.latitud},${this.lugar.geoposicion.longitud}`;
    } else {
      window.location.href = `maps://maps.apple.com/?q=${this.lugar.geoposicion.latitud},${this.lugar.geoposicion.longitud}`;
    }
  }
}
