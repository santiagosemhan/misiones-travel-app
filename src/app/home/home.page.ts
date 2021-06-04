import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { LugaresService } from './../_services/lugares.service';
import { stackRouteDrawer, stackRouteDw, mainCategory } from './../_globals/globals';
import { MsgService } from './../_services/msg.service';
import { ApiService } from './../_services/api.service';
import { MapboxService } from './../_services/mapbox.service';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { forkJoin, Observable } from 'rxjs';


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
  dragendEventAttach = false;

  constructor(public modalController: ModalController,
    private splashScreen: SplashScreen,
    private changeDetectorRef: ChangeDetectorRef,
    private mapBoxService: MapboxService,
    private apiService: ApiService,
    private router: Router,
    private geolocation: Geolocation,
    private msgService: MsgService,
    public lugaresService: LugaresService) {

  }

  ngOnInit() {

    this.msgService.presentLoading('Cargando...')
    this.loadLugares();

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
          // let coordinates = `${resp.coords.latitude},${resp.coords.longitude}`
          this.coordinates.latitud = resp.coords.latitude
          this.coordinates.longitud = resp.coords.longitude
          resolve('resolved');

        }).catch((error) => {
          console.log('Error getting location', error);
          let lat = -28.1331273;
          let lang = -54.6580317;
          this.mapa = this.mapBoxService.mostrarMapa('map', lat, lang)
          // let coordinates = `${resp.coords.latitude},${resp.coords.longitude}`
          this.coordinates.latitud = lat
          this.coordinates.longitud = lang
          resolve('resolved');
        });


      }, 300)
    });
  }

  async loadLugares() {
    const reslt = await this.initMap();
    this.splashScreen.hide();

    let limit = 25;
    let paramsImerpdibles = {
      'slug': 'imperdibles',
    }
    let paramsAtracciones = {
      'slug': 'atracciones'
    }

    forkJoin({
      imperdibles: this.apiService.get(`categorias?slug_in=imperdibles`),
      atracciones: this.apiService.get(`categorias?slug_in=atracciones&slug_in=atracciones-camping&slug_in=atracciones-mirador-punto-panoramico`),
    }).subscribe((arrData) => {
      // console.log('arrData', arrData)
      this.msgService.dismissLoading()
      this.loading = false;

      let geoJson = {
        type: 'FeatureCollection',
        features: []
      };

      let cantAtracciones = 0;
      let atracciones: any = arrData.atracciones;
      atracciones.forEach(categoria => {
        categoria.lugares.forEach(lugar => {
          if (lugar.location && cantAtracciones <= limit) {
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
            cantAtracciones++;
          }
        });
      });

      let cantImperdibles = 0;
      let imperdibles: any = arrData.imperdibles;
      imperdibles.forEach(categoria => {
        categoria.lugares.forEach(lugar => {
          if (lugar.location && cantImperdibles <= limit) {
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
            cantImperdibles++;
          }
        });
      });


      this.mapBoxService.drawPrincipales('map', this.coordinates.latitud, this.coordinates.longitud, geoJson, (id) => { this.goToLugar(id) })


    });

  }

  loadNears(coordinates, categoria?, center = true) {

    // let where = [
    //   { 'relevancia': { '$in': 'muy_alta' } },
    //   { 'relevancia': { '$in': 'alta' } }
    // ]
    if (categoria == 'circuito') {
      return;
    }

    let paramsCat = {
      'slug': categoria
    }
    this.apiService.get(`categorias`, paramsCat).subscribe((respCat: any) => {

      let where = '';

      respCat[0].sub_categorias.map((data) => {
        where += `&where[][categorias][$in]=${data.id}`;
      })

      let params = {
        coordinates: coordinates,
        // maxDistance: 5000000,
        maxDistance: 30000,
        // limit: 15,
      }

      this.apiService.get(`lugares/near?${where}`, params).subscribe(
        (lugares: any) => {
          // this.lugares = lugares
          console.log('lugares/near', lugares)
          // this.msgService.dismissLoading()

          // add markers

          let geoJson = {
            type: 'FeatureCollection',
            features: []
          };

          lugares.forEach((lugar) => {

            if (lugar.location) {
              geoJson.features.push(
                {
                  "type": "Feature",
                  "geometry": lugar.location,
                  "properties": {
                    "title": lugar.nombre,
                    "id": lugar.id,
                    "icon": {
                      "iconUrl": `/assets/pins/pin_${categoria}.svg`,
                      "iconSize": [30, 30], // size of the icon
                      "iconAnchor": [25, 25], // point of the icon which will correspond to marker's location
                      "popupAnchor": [0, -25], // point from which the popup should open relative to the iconAnchor
                      "className": "dot"
                    }
                  }
                }
              )
            }

          });

          this.loading = false;

          if (center) {
            this.mapBoxService.updateLayer('map', this.coordinates.latitud, this.coordinates.longitud, 12, geoJson, (id) => { this.goToLugar(id) })
          } else {
            this.mapBoxService.updateLayerNoCenter(12, geoJson, (id) => { this.goToLugar(id) })
          }

          if (!this.dragendEventAttach) {
            this.mapa.on('dragend', function () {
              let coordinates = `${this.mapa.getCenter().lng},${this.mapa.getCenter().lat}`
              this.loadNears(coordinates, this.categoriaSelected, false)
            }.bind(this, categoria));
            this.dragendEventAttach = true;
          }
        });

    })
  }

  toggleBackdrop(isVisible) {
    this.backDropVisible = isVisible;
    this.changeDetectorRef.detectChanges();
  }

  openCategoria(categoria) {
    mainCategory.splice(0, mainCategory.length);
    mainCategory.push(categoria);
    // stackRouteDw.next(categoria);
    stackRouteDrawer.push(categoria);
    this.showDrawerPrincipal = false;
    this.categoriaSelected = categoria;
    // this.dragendEventAttach = false;

    // empty array
    // mainCategory.splice(0, mainCategory.length);

    let coordinates = `${this.coordinates.longitud},${this.coordinates.latitud}`
    // let coordinates = `${this.coordinates.latitud},${this.coordinates.longitud}`
    this.loadNears(coordinates, categoria);

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

    stackRouteDrawer.pop()

    if (stackRouteDrawer.length > 0) {
      console.log('back')
      if (stackRouteDrawer.length == 1) {
        this.categoriaSelected = stackRouteDrawer[0];
        stackRouteDw.next(stackRouteDrawer);
      } else {
        this.categoriaSelected = stackRouteDrawer[stackRouteDrawer.length - 1];
        stackRouteDw.next(stackRouteDrawer);
      }

    } else {
      this.showCircuitos = false;
      this.showDrawerPrincipal = true;
      this.showDrawerCategoria = false;
    }
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
    stackRouteDrawer.pop()
    this.showCircuitos = false;
    this.showDrawerPrincipal = true;
    this.showDrawerCategoria = false;
    this.router.navigate(['/home'])
  }

  goToPath(path) {
    this.router.navigate([path])
  }

}
