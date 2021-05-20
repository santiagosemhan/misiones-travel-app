import { stackRouteDrawer } from './../_globals/globals';
import { MsgService } from './../_services/msg.service';
import { ApiService } from './../_services/api.service';
import { MapboxService } from './../_services/mapbox.service';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  backDropVisible = false;
  mapa;

  categorias;
  categoriaSelected;
  esLugar = false;
  categoriaPrincipal;
  lugares = [];
  loadingLugares = false;
  toBack = null;
  showCircuitos = false;
  showDrawerPrincipal = true;
  showDrawerCategoria = false;
  coordinates = {
    longitud: null,
    latitud: null
  };
  backButton = null;
  loading = false;

  constructor(public modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private mapBoxService: MapboxService,
    private apiService: ApiService,
    private router: Router,
    private geolocation: Geolocation,
    private msgService: MsgService) {

  }

  ngOnInit() {

    this.msgService.presentLoading('Cargando...')

    this.loadCategorias();

  }

  initMap() {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('initmap')

        this.geolocation.getCurrentPosition().then((resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          console.log('getCurrentPosition', resp)
          this.mapa = this.mapBoxService.mostrarMapa('map', resp.coords.latitude, resp.coords.longitude)
          let coordinates = `${resp.coords.latitude},${resp.coords.longitude}`
          this.coordinates.latitud = resp.coords.latitude
          this.coordinates.longitud = resp.coords.longitude
          // this.load5Near(coordinates);
          // this.loadPrincipales();
          resolve('resolved');

        }).catch((error) => {
          console.log('Error getting location', error);
        });


      }, 300)
    });
  }

  async loadCategorias() {
    const reslt = await this.initMap();

    let params = {
      // 'activo': true
      '_limit': 10
    }

    await this.apiService.get('categorias', params).subscribe(
      (categorias: any) => {
        this.categorias = categorias
        console.log('categorias', categorias)
        this.msgService.dismissLoading()
        this.loading = false;

        this.loadPrincipales();

      });

  }

  loadPrincipales() {
    // let categorias = this.categorias;
    let geoJson = {
      type: 'FeatureCollection',
      features: []
    };

    let imperdibles = 1;
    let atracciones = 1;

    this.categorias.forEach(categoria => {

      // console.log('forEach', categoria.slug)
      if (categoria.slug == "imperdibles") {
        // if (imperdibles <= 15) {
        categoria.lugares.forEach(lugar => {
          if (lugar.location && imperdibles <= 15) {
            geoJson.features.push(
              {
                "type": "Feature",
                "geometry": lugar.location,
                "properties": {
                  "title": lugar.nombre,
                  "id": lugar.id,
                  "icon": {
                    "iconUrl": `/assets/pins/pin_imperdibles.svg`,
                    "iconSize": [30, 30], // size of the icon
                    "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                    "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                    "className": "dot"
                  }
                }
              }
            )
            imperdibles++;
          }
        });
        // }
      }
      if (categoria.slug == 'atracciones') {

        categoria.lugares.forEach(lugar => {
          if (lugar.location && atracciones <= 15) {
            geoJson.features.push(
              {
                "type": "Feature",
                "geometry": lugar.location,
                "properties": {
                  "title": lugar.nombre,
                  "id": lugar.id,
                  "icon": {
                    "iconUrl": `/assets/pins/pin_atracciones.svg`,
                    "iconSize": [30, 30], // size of the icon
                    "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                    "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                    "className": "dot"
                  }
                }
              }
            )
            atracciones++;
          }
        });

      }
    });

    this.mapBoxService.drawPrincipales('map', this.coordinates.latitud, this.coordinates.longitud, geoJson, (id) => { this.goToLugar(id) })
  }

  load5Near(coordinates) {

    // let where = [
    //   { 'relevancia': { '$in': 'muy_alta' } },
    //   { 'relevancia': { '$in': 'alta' } }
    // ]

    let where = 'where[][relevancia][$in]=muy_alta&where[][relevancia][$in]=alta';

    let params = {
      coordinates: coordinates,
      maxDistance: 5000000,
      limit: 5,
    }

    this.apiService.get(`lugares/near?${where}`, params).subscribe(
      (lugares) => {
        // this.lugares = lugares
        console.log('lugares/near', lugares)
        this.msgService.dismissLoading()
      });
  }

  toggleBackdrop(isVisible) {
    this.backDropVisible = isVisible;
    this.changeDetectorRef.detectChanges();
  }

  openCategoria(categoria) {
    this.showDrawerPrincipal = false;
    this.categoriaSelected = categoria;

    // empty array
    stackRouteDrawer.splice(0, stackRouteDrawer.length);
    stackRouteDrawer.push(categoria);

    console.log('stackRouteDrawer', stackRouteDrawer)

    if (categoria == 'circuito') {
      this.showCircuitos = true;
      return;
    }

    this.categoriaPrincipal = categoria;
    this.showDrawerCategoria = true;
  }

  openLugar($event) {
    this.categoriaSelected = $event;
    this.esLugar = true;

    this.mapa.flyTo({
      center: this.categoriaSelected.location.coordinates,
      zoom: 16
    });
    this.goToLugar(this.categoriaSelected.id);
  }

  goToLugar(lugarId) {
    this.router.navigate(['/lugar', lugarId])
  }

  redrawMap(item) {
    // add markers

    let geoJson = {
      type: 'FeatureCollection',
      features: []
    };

    let indexCenter = 0;
    let center = {
      lat: -28.1331273,
      lang: -54.6580317
    }
    item.lugares.forEach((lugar) => {

      // console.log('lugar cat princ', lugar, this.categoriaPrincipal)

      geoJson.features.push(
        {
          "type": "Feature",
          "geometry": lugar.location,
          "properties": {
            "title": lugar.nombre,
            "id": lugar.id,
            "icon": {
              "iconUrl": `/assets/pins/pin_${this.categoriaPrincipal}.svg`,
              "iconSize": [30, 30], // size of the icon
              "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
              "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
              "className": "dot"
            }
          }
        }
      )

      if (indexCenter <= 0) {
        center.lat = lugar.geoposicion.latitud
        center.lang = lugar.geoposicion.longitud
      }

      indexCenter++;
    });

    this.loading = false;

    if (this.categoriaPrincipal == "imperdibles") {
      this.mapBoxService.updateLayer('map', center.lat, center.lang, 12, geoJson, (id) => { this.goToLugar(id) })
    } else if (this.categoriaPrincipal == "atracciones") {
      this.mapBoxService.updateLayer('map', -28.1331273, -54.6580317, 6, geoJson, (id) => { this.goToLugar(id) })
    }

  }

  backCategoria() {
    // console.log('backCategoria()', this.backButton)
    stackRouteDrawer.pop()
    console.log('stackRouteDrawer', stackRouteDrawer)
this.categoriaSelected = 'imperdibles';
    if (stackRouteDrawer.length > 0) {
      console.log('back')
      if (stackRouteDrawer.length == 1) {
        this.categoriaSelected = stackRouteDrawer[0];

      } else {
        this.categoriaSelected = stackRouteDrawer[stackRouteDrawer.length - 1];
      }

    } else {
      this.showCircuitos = false;
      this.showDrawerPrincipal = true;
      this.showDrawerCategoria = false;
    }
  }


  autocompletMotivoDisplay(p) {
    return p ? p.descripcion : '';
  }

  clearMotivo() {
    // this.form.get('motivo').setValue('')
  }

  autocompleteMotivo() {
    // let daap = this.session.daap;
    // this.form.get('motivo').valueChanges
    //   .pipe(
    //     startWith(''),
    //     debounceTime(500),
    //     tap(() => {
    //       // this.errorMsg = "";
    //       this.motivos = [];
    //       this.motivosLoading = true;
    //     }),
    //     switchMap(value => this.api.get("motivo_consulta/suggest", {
    //       ...daap,
    //       texto: value
    //     })
    //       .pipe(
    //         finalize(() => {
    //           this.motivosLoading = false
    //         }),
    //       )
    //     )
    //   )
    //   .subscribe((data: any) => {
    //     if (data['Search'] == undefined) {
    //       // this.errorMsg = data['Error'];
    //       this.motivos = [];
    //     } else {
    //       // this.errorMsg = "";
    //       this.motivos = data['Search'];
    //     }

    //     this.motivos = data.data;

    //   });
  }

  dibujarCircuito(circuito) {
    // add markers
    // let center = circuito[0].lugar.geoposicion;
    let center = circuito[0].lugar.location.coordinates;
    // let center = circuito.circuito[0].location.coordinates;
    let coordinates = [];
    let geoJson = {
      type: 'FeatureCollection',
      features: []
    };

    circuito.forEach((circuito) => {

      console.log('lugar circuito', circuito)

      let lugar = circuito.lugar

      geoJson.features.push(
        {
          "type": "Feature",
          "geometry": lugar.location,
          "properties": {
            "title": lugar.nombre,
            "id": lugar.id,
            "icon": {
              "iconUrl": `/assets/pins/pin_circuitos.svg`,
              "iconSize": [30, 30], // size of the icon
              "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
              "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
              "className": "dot"
            }
          }
        }
      )

      if (lugar.location) {
        coordinates.push(lugar.location.coordinates)
      }

    });

    console.log('center', center)
    this.mapBoxService.drawCircuitos('map', center[1], center[0], geoJson, coordinates, circuito.modalidad, (id) => { this.goToLugar(id) })
  }

  changeCircuito(item) {
    console.log('changeCircuito', item)

    this.dibujarCircuito(item.circuito);

  }

  backCircuitos() {
    this.showCircuitos = false;
    this.showDrawerPrincipal = true;
    this.showDrawerCategoria = false;
    this.router.navigate(['/home'])
  }

  goToPath(path) {
    this.router.navigate([path])
  }

}
