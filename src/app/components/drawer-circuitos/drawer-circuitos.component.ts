import { element } from 'protractor';
import { ApiService } from './../../_services/api.service';
import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mt-drawer-circuitos',
  templateUrl: './drawer-circuitos.component.html',
  styleUrls: ['./drawer-circuitos.component.scss'],
})
export class DrawerCircuitosComponent implements OnInit {

  @ViewChild('drawerCircuitos', { read: ElementRef }) drawerCircuitos: ElementRef;
  @Input() circuitos;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();
  @Output('btnClick') btnClick: EventEmitter<boolean> = new EventEmitter();


  loading = true;

  isOpen = false;
  openHeight = 0;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3.2,
  };

  circuitoSelected;
  distancia = 0;
  localidades = [];


  constructor(private platform: Platform, private gestureCtrl: GestureController,
    private apiService: ApiService,
    private router: Router) {
  }

  ngOnInit() {



    this.loadCircuitos()
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log(changes)
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

    // if (changes.categoria.currentValue.lugares && changes.categoria.currentValue.lugares.length > 0) {
    //   console.log('tiene lugares')
    //   // this.lugares = changes.categoria.currentValue
    //   // this.categorias = null;
    //   // this.hoja = null;
    // } else if (changes.categoria.currentValue.localidad) {
    //   console.log('es lugar')
    //   // this.lugares = null;
    //   // this.categorias = null;
    //   // this.hoja = changes.categoria.currentValue;
    // }

    // this.padre = changes.categoria.previousValue



  }

  async loadCircuitos() {

    let params = {
      // 'activo': true
    }

    await this.apiService.get('circuitos', params).subscribe(
      (circuitos) => {
        this.circuitos = circuitos
        console.log('circuitos', circuitos)
        this.loading = false;
      });
  }



  arrayOne(n: number): any[] {
    return Array(n);
  }



  async ngAfterViewInit() {

    const drawerCircuitos = this.drawerCircuitos.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 30;
    // console.log('openHeight', this.openHeight)
    const gesture = await this.gestureCtrl.create({
      el: drawerCircuitos,
      gestureName: 'swipe',
      direction: 'y',
      onMove: evt => {
        // console.log('onMove', evt)
        if (evt.deltaY < this.openHeight) {
          return;
        }
        drawerCircuitos.style.transform = `translateY(${evt.deltaY}px)`

      },
      onEnd: evt => {
        // console.log('onEnd', evt)
        if (evt.deltaY < -30 && !this.isOpen) {
          drawerCircuitos.style.transition = '.6s ease-out';
          drawerCircuitos.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isOpen = true;
        } else if (evt.deltaY > 30 && this.isOpen) {
          drawerCircuitos.style.transition = '.6s ease-out';
          drawerCircuitos.style.transform = '';
          this.openState.emit(false);
          this.isOpen = false;
        }
      }
    });
    gesture.enable(true);
  }

  toggleDrawer() {
    const drawerCircuitos = this.drawerCircuitos.nativeElement;
    this.openState.emit(!this.isOpen);

    if (!this.isOpen) {
      drawerCircuitos.style.transition = '.8s ease-out';
      drawerCircuitos.style.transform = `translateY(${-this.openHeight}px)`;
    } else {
      drawerCircuitos.style.transition = '.8s ease-out';
      drawerCircuitos.style.transform = '';
    }

    this.isOpen = !this.isOpen;
  }

  openCircuito(circuito) {

    if (circuito) {
      this.btnClick.emit(circuito);
      this.circuitoSelected = circuito;
      this.circuitoSelected.circuito.forEach(element => {
        this.apiService.get(`localidades/${element.lugar.localidad}`).subscribe((localidad: any) => {
          if (!this.localidades.find(o => o.nombre === localidad.nombre))
            this.localidades.push(localidad)

        })

      });
    }

  }

  goToLugar(lugar) {
    this.router.navigate(['/lugar', lugar.id])
  }
}
