import { ApiService } from './../../_services/api.service';
import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';


@Component({
  selector: 'mt-drawer-categoria',
  templateUrl: './drawer-categoria.component.html',
  styleUrls: ['./drawer-categoria.component.scss'],
})
export class DrawerCategoriaComponent implements AfterViewInit {

  @ViewChild('drawerCategoria', { read: ElementRef }) drawerCategoria: ElementRef;
  @Input() categoria;
  @Input() categoriaPrincipal;
  @Output('openStateChnaged') openState: EventEmitter<boolean> = new EventEmitter();
  @Output('btnClick') btnClick: EventEmitter<boolean> = new EventEmitter();

  categorias;
  lugares;
  hoja;
  padre;
  loading = true;

  isOpen = false;
  openHeight = 0;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 3.2,
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

      return element[this.categoria.slug]
    });

    if (color)
      document.documentElement.style.setProperty('--fondo-drawer', color[this.categoria.slug]);

    this.loadCategorias()
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log(changes)
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

    if (changes.categoria.currentValue.lugares && changes.categoria.currentValue.lugares.length > 0) {
      console.log('tiene lugares')
      this.lugares = changes.categoria.currentValue
      this.categorias = null;
      this.hoja = null;
    } else if (changes.categoria.currentValue.localidad) {
      console.log('es lugar')
      this.lugares = null;
      this.categorias = null;
      this.hoja = changes.categoria.currentValue;
    }

    this.padre = changes.categoria.previousValue



  }

  async loadCategorias() {
    if (!this.categoria) {
      this.loading = false;
      return;
    }
    let params = {
      'categoria': this.categoria.id
    }
    await this.apiService.get('categorias', params).subscribe(
      (categorias) => {
        this.categorias = categorias;
        this.lugares = null;
        console.log('loadCategorias', categorias)
        this.loading = false;
      });
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }



  async ngAfterViewInit() {

    const drawerCategoria = this.drawerCategoria.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 30;
    // console.log('openHeight', this.openHeight)
    const gesture = await this.gestureCtrl.create({
      el: drawerCategoria,
      gestureName: 'swipe',
      direction: 'y',
      onMove: evt => {
        // console.log('onMove', evt)
        if (evt.deltaY < -this.openHeight) {
          return;
        }
        drawerCategoria.style.transform = `translateY(${evt.deltaY}px)`

      },
      onEnd: evt => {
        // console.log('onEnd', evt)
        if (evt.deltaY < -30 && !this.isOpen) {
          drawerCategoria.style.transition = '.4s ease-out';
          drawerCategoria.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isOpen = true;
        } else if (evt.deltaY > 30 && this.isOpen) {
          drawerCategoria.style.transition = '.4s ease-out';
          drawerCategoria.style.transform = '';
          this.openState.emit(false);
          this.isOpen = false;
        }
      }
    });
    gesture.enable(true);
  }

  toggleDrawer() {
    const drawerCategoria = this.drawerCategoria.nativeElement;
    this.openState.emit(!this.isOpen);

    if (!this.isOpen) {
      drawerCategoria.style.transition = '.4s ease-out';
      drawerCategoria.style.transform = '';
      this.isOpen = false;
    } else {
      drawerCategoria.style.transition = '.4s ease-out';
      drawerCategoria.style.transform = `translateY(${-this.openHeight}px)`;
      this.isOpen = true;
    }
  }

  openCategoria(itemSubCategoria) {

    // if (itemSubCategoria.categorias) {
    this.btnClick.emit(itemSubCategoria);
    // }
  }

}



