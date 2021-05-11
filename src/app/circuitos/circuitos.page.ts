import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from './../_services/api.service';
import { MapboxService } from './../_services/mapbox.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-circuitos',
  templateUrl: './circuitos.page.html',
  styleUrls: ['./circuitos.page.scss'],
})
export class CircuitosPage implements OnInit {


  circuitoSelected: false;
  mapa;
  circuitos;

  constructor(public modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private mapBoxService: MapboxService,
    private apiService: ApiService,
    private router: Router,
    private geolocation: Geolocation) { }

  ngOnInit() {
    this.initMap();
    this.loadCircuitos();
  }

  initMap() {
    setTimeout(() => {
      console.log('initmap')

      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log('getCurrentPosition', resp)
        this.mapa = this.mapBoxService.mostrarMapa('map', resp.coords.latitude, resp.coords.longitude)
      }).catch((error) => {
        console.log('Error getting location', error);
      });


    }, 300)
  }

  async loadCircuitos() {

    let params = {
      // 'activo': true
    }

    await this.apiService.get('circuitos', params).subscribe(
      (circuitos) => {
        this.circuitos = circuitos
        console.log('circuitos', circuitos)
      });
  }

  toggleBackdrop(event) {

  }

  changeCircuito(circuito) {

  }

  backCircuito() {

  }

}
