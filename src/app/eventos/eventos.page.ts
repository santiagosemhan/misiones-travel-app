import { MsgService } from './../_services/msg.service';
import { ApiService } from './../_services/api.service';
import { Component, OnInit } from '@angular/core';
import { formatDistance, subDays, format, parseISO } from 'date-fns'
// import { DateFnsConfigurationService } from '../lib/src/date-fns-configuration.service';



@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  // faltan;
  eventos = null;
  options = {
    locale: 'es',
    addSuffix: true
  };
  loading = false;
  searchText = '';
  isoDateString = new Date().toISOString();

  constructor(private apiService: ApiService,
    private msgService: MsgService) { }

  ngOnInit() {
    this.loading = true;
    this.msgService.presentLoading('Cargando Eventos...');

    this.loadEventos();

    // this.faltan = formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true })

  }

  loadEventos($event?) {

    let params = {
      'activo_eq': 'true',
      'fecha_gte': this.isoDateString
    }
    this.apiService.get('eventos', params).subscribe(
      (eventos) => {

        this.eventos = eventos;

        if ($event) {
          $event.target.complete();
        }

        this.msgService.dismissLoading();
        this.loading = false;

      },
      (error) => {
        console.error(error)
        this.msgService.dismissLoading();
        this.loading = false;
      })
  }

  openEvento(evento) {
    window.open(evento.url, '_system');
  }

  doRefresh($event) {
    this.msgService.presentLoading('Cargando Eventos...');
    this.loading = true;
    this.loadEventos($event)
  }

  buscar() {
    console.log(this.searchText)

    if (this.searchText !== '') {

      this.msgService.presentLoading('Bsucando Eventos...');

      let params = {
        'activo_eq': 'true',
        'fecha_gte': this.isoDateString,
        'nombre_contains': this.searchText
      }
      this.apiService.get('eventos', params).subscribe(
        (eventos) => {

          this.eventos = eventos;

          this.msgService.dismissLoading();
          this.loading = false;

        },
        (error) => {
          console.error(error)
          this.msgService.dismissLoading();
          this.loading = false;
        })
    }
  }

}
