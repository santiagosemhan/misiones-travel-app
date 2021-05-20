import { ApiService } from './../../_services/api.service';
import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { stackRouteDrawer } from 'src/app/_globals/globals';


@Component({
  selector: 'mt-drawer-categoria',
  templateUrl: './drawer-categoria.component.html',
  styleUrls: ['./drawer-categoria.component.scss'],
})
export class DrawerCategoriaComponent implements AfterViewInit {

  @ViewChild('drawerCategoria', { read: ElementRef }) drawerCategoria: ElementRef;
  @Input() categoria;
  @Input() categoriaPrincipal;
  @Input() loading;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();
  // @Output('btnClick') btnClick: EventEmitter<boolean> = new EventEmitter();
  @Output('btnLugarClick') btnLugarClick: EventEmitter<boolean> = new EventEmitter();
  @Output('redrawMap') redrawMap: EventEmitter<boolean> = new EventEmitter();
  // @Output('backButton') backButton: EventEmitter<boolean> = new EventEmitter();

  currentCategoria;
  subCategoria;
  categorias;
  lugares;
  hoja;
  padre;
  // loading = true;

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
  changeLog: string[] = [];

  constructor(private platform: Platform, private gestureCtrl: GestureController,
    private apiService: ApiService) {
  }

  ngOnInit() {

    let color = this.colores.find((element) => {

      // return element[this.categoria.slug]
      return element[this.categoria]
    });

    if (color)
      document.documentElement.style.setProperty('--fondo-drawer', color[this.categoria]);

    this.loadCategorias()
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)

    // if (changes.categoria && changes.categoria.previousValue) {

    // if (changes.categoria.previousValue == "imperdibles" ||
    //   changes.categoria.previousValue == "atracciones") {
    //   this.categoria = changes.categoria.previousValue;
    // } else if (changes.categoria.previousValue.slug == "imperdibles" ||
    //   changes.categoria.previousValue.slug == "atracciones") {
    //   this.categoria = changes.categoria.previousValue.slug;
    // }

    //   this.subCategoria = null;
    // this.loadCategorias();

    // }
    const log: string[] = [];
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        const from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));  


  }

  async loadCategorias() {
    this.loading = true;
    if (!this.categoria) {
      this.loading = false;
      return;
    }
    let params = {
      // 'categoria': this.categoria.id,
      'slug': this.categoria.slug ? this.categoria.slug : this.categoria
    }
    await this.apiService.get('categorias', params).subscribe(
      (categorias: any) => {
        this.currentCategoria = categorias[0];
        this.categorias = categorias[0].sub_categorias;
        this.lugares = null;
        // console.log('loadCategorias', categorias, this.categorias)
        this.loading = false;
      });
  }

  arrayOne(n: number): any[] {
    return Array(n);
  }

  async ngAfterViewInit() {

    const drawerCategoria = this.drawerCategoria.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 40;
    // console.log('openHeight', this.openHeight)
    const gesture = await this.gestureCtrl.create({
      el: drawerCategoria,
      gestureName: 'swipe',
      direction: 'y',
      onMove: evt => {
        // console.log('onMove', evt.deltaY)
        if (evt.deltaY < -this.openHeight) {
          return;
        }
        drawerCategoria.style.transform = `translateY(${evt.deltaY}px)`

      },
      onEnd: evt => {
        // console.log('onEnd', evt)
        if (evt.deltaY < -40 && !this.isOpen) {
          drawerCategoria.style.transition = '.6s ease-out';
          drawerCategoria.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isOpen = true;
        } else if (evt.deltaY > 40 && this.isOpen) {
          drawerCategoria.style.transition = '.6s ease-out';
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
      drawerCategoria.style.transition = '.8s ease-out';
      drawerCategoria.style.transform = `translateY(${-this.openHeight}px)`;
    } else {
      drawerCategoria.style.transition = '.8s ease-out';
      drawerCategoria.style.transform = '';
    }

    this.isOpen = !this.isOpen;
  }

  openSubCategoria(itemSubCategoria) {
    console.log('openSubCategoria(itemSubCategoria)', itemSubCategoria)
    stackRouteDrawer.push(itemSubCategoria.slug);
    console.log('stackRouteDrawer', stackRouteDrawer);
    this.subCategoria = itemSubCategoria;


    // si tiene subcategorias
    if (itemSubCategoria.sub_categorias.length <= 0) {
      this.loading = true

      this.apiService.get(`categorias/${itemSubCategoria.id}`).subscribe(
        (categorias: any) => {
          console.log('${itemSubCategoria.id}', categorias)
          this.lugares = categorias.lugares
          this.redrawMap.emit(categorias);
          this.loading = false;
        });
    }
  }

  openLugar(lugar) {
    this.btnLugarClick.emit(lugar);
  }


}



