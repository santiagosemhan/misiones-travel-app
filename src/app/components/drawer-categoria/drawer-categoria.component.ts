import { ApiService } from './../../_services/api.service';
import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { stackRouteDrawer, stackRouteDw, mainCategory } from 'src/app/_globals/globals';


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
  @Output('btnLugarClick') btnLugarClick: EventEmitter<boolean> = new EventEmitter();
  @Output('redrawMap') redrawMap: EventEmitter<boolean> = new EventEmitter();
  @Output('btnChangeCategoria') changeCategoria: EventEmitter<boolean> = new EventEmitter();

  objCategoriaPrincipal;
  currentCategoria;
  subCategoria;
  categorias;
  lugares;
  hoja;
  padre;
  // loading = true;
  isoDateString = new Date().toISOString();
  imagenGenerica = `https://misiones-travel-fs.s3.sa-east-1.amazonaws.com/icon_4b335a8779.png?v=${this.isoDateString}`

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
  ];

  relevancia = [];


  // colores
  changeLog: string[] = [];

  constructor(private platform: Platform, private gestureCtrl: GestureController,
    private apiService: ApiService) {

    this.relevancia["muy_baja"] = 0;
    this.relevancia["baja"] = 1;
    this.relevancia["regular"] = 3;
    this.relevancia["alta"] = 4;
    this.relevancia["muy_alta"] = 5;
  }

  ngOnInit() {

    stackRouteDw.subscribe((data) => {
      this.loading = true;
      console.log('stackRouteDw', data)
      // TODO fix 3 calls
      if (data && data.length > 0) {
        this.categorias = null;
        this.lugares = null;
        this.categoria = data[data.length - 1];
        this.loadCategorias();
      }
    })

    let color = this.colores.find((element) => {

      // return element[this.categoria.slug]
      return element[mainCategory[0]]
    });

    if (color)
      document.documentElement.style.setProperty('--fondo-drawer', color[mainCategory[0]]);

    this.loadCategorias();
    this.loadCategoriaPrincipal();
  }

  async loadCategoriaPrincipal() {
    this.loading = true;

    let params = {
      'slug': this.categoriaPrincipal
    }
    await this.apiService.get('categorias', params).subscribe(
      (categoriaPrincipal: any) => {

        this.objCategoriaPrincipal = categoriaPrincipal[0];

        this.loading = false;
      });
  }

  async loadCategorias() {
    this.loading = true;
    if (!this.categoria) {
      this.loading = false;
      return;
    }
    let params = {
      'slug': this.categoria.slug ? this.categoria.slug : this.categoria
    }
    await this.apiService.get('categorias', params).subscribe(
      (categorias: any) => {
        console.log('getCategroia', categorias[0])
        this.currentCategoria = categorias[0];
        this.lugares = null;
        this.categorias = null;
        this.subCategoria = null;

        if (categorias[0].sub_categorias && categorias[0].sub_categorias.length > 0) {
          this.categorias = categorias[0].sub_categorias;
        } else if (categorias[0].lugares.length > 0) {
          this.lugares = categorias[0].lugares;
        }

        // console.log('loadCategorias', categorias, this.categorias)
        this.loading = false;
      });
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
    this.loading = true;
    this.categorias = null;

    // console.log('openSubCategoria(itemSubCategoria)', itemSubCategoria)
    stackRouteDrawer.push(itemSubCategoria.slug);
    // console.log('stackRouteDrawer', stackRouteDrawer);
    this.subCategoria = itemSubCategoria;

    if (itemSubCategoria.sub_categorias.length <= 0) {

      this.apiService.get(`categorias/${itemSubCategoria.id}`).subscribe(
        (categorias: any) => {
          
          // ordeno lugares por relevancia
          let lug = categorias.lugares.sort((a, b) => {

            if (a.relevancia === undefined || a.relevancia === null) {              
              a.relevancia = 'muy_baja'
            }

            if (b.relevancia === undefined || b.relevancia === null) {
              a.relevancia = 'muy_baja'
            }

            return this.relevancia[a.relevancia] - this.relevancia[b.relevancia];
          });

          this.lugares = lug.reverse();
          this.redrawMap.emit(categorias);
          this.loading = false;
        });
    }
    // this.loading = false;
  }


  openLugar(lugar) {
    this.btnLugarClick.emit(lugar);
  }


}



