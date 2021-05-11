import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
declare var mapboxgl;

export interface MapboxOutput {

  features: Feature[];

}

export interface Feature {
  place_name: string;
  geometry: any
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  maker;
  mapa;
  mapStyle = 'mapbox://styles/misionestravel/ckkxzvr885oys17ug9gk4jqrq';

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox
  }

  mostrarMapa(elementId, lat = -27.3773499, lng = -55.8801476, createMarker = true) {

    // mapboxgl.accessToken = environment.mapbox
    let map = new mapboxgl.Map({
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: this.mapStyle,
      center: [lng, lat],
      zoom: 14,
      // pitch: 45,
      // bearing: -17.6,
      container: elementId,
      antialias: true,
    });

    if (createMarker) {
      this.marker(map, lng, lat)
    }

    this.mapa = map;
    return map

  }

  marker(map, lng, lat) {

    let el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url(assets/pins/pin_ud_esta_aqui.svg)`
    el.style.width = '50px';
    el.style.height = '50px';
    el.style.backgroundRepeat = 'no-repeat';

    // return new mapboxgl.Marker({
    //   draggable: false,
    //   // element: './assets/pins/pin_ud_esta_aqui.svg'
    // })
    //   .setLngLat([lng, lat])
    //   .addTo(map);

    return new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map);


  }
  placename(lng, lat) {
    let token = environment.mapbox
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=poi&access_token=${token}`;
    return this.http.get(url);
  }

  search_word(query: string) {
    let token = environment.mapbox
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(`${url}${query}.json?types=address&access_token=${token}`)
      .pipe(map((res: MapboxOutput) => {
        return res.features;
      }));
  }

  searchNominatium(query: string) {
    // let token = environment.mapbox
    const url = `https://map.marandu.com.ar/nominatim/search.php?q=${query}&format=json&addressdetails=1`;
    return this.http.get(url)
      .pipe();
  }

  updateLayer(elementId, lat = -27.3773499, lng = -55.8801476, geoJson, callback) {
    console.log('geoJson', geoJson, this.mapa)

    // let map = this.mapa
    let map = new mapboxgl.Map({
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: this.mapStyle,
      center: [lng, lat],
      zoom: 12,
      // pitch: 45,
      // bearing: -17.6, 
      container: elementId,
      antialias: true,
      "transition": {
        "duration": 300,
        "delay": 0
      }
    });

    // map.addControl(new mapboxgl.NavigationControl());

    geoJson.features.forEach(function (marker) {
      console.log('marker', marker)
      if (marker.geometry) {
        // create a DOM element for the marker
        let el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.properties.icon.iconUrl})`
        el.style.width = marker.properties.icon.iconSize[0] + 'px';
        el.style.height = marker.properties.icon.iconSize[1] + 'px';
        el.style.backgroundRepeat = 'no-repeat';

        el.addEventListener('click', function () {
          // goto atraccion
          // window.alert(marker.properties.title);
          // callback(marker.properties.id)
          map.flyTo({
            center: marker.geometry.coordinates,
            zoom: 16
          });
        });

        let elementPopup = document.createElement('div');
        elementPopup.append(`${marker.properties.title}`)

        elementPopup.addEventListener('click', function () {
          // goto atraccion
          // window.alert(marker.properties.title);
          callback(marker.properties.id)
        });

        let popup = new mapboxgl.Popup(
          {
            offset: 25,
            className: 'popup-marker'
          }
        )
          // .setText(marker.properties.title)
          .setDOMContent(elementPopup)
          ;



        // add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(popup)
          .addTo(map);
      }

    });

  }

  drawPrincipales(elementId, lat = -27.3773499, lng = -55.8801476, geoJson, callback) {
    // console.log('geoJson', geoJson, this.mapa)

    // let map = this.mapa
    let map = new mapboxgl.Map({
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: this.mapStyle,

      // center: [-54.8539037, -27.2197932],
      // center: [-55.0079017,-27.3562242],
      // center: [-55.1653047,-27.5784692],
      // center: [-55.3226567,-27.4848362],
      // center: [-55.4389047,-28.0519852],
      center: [-54.6580317, -28.1331273],
      zoom: 6.5,
      // pitch: 45,
      // bearing: -17.6, 
      container: elementId,
      antialias: true,
      "transition": {
        "duration": 300,
        "delay": 0
      }
    });

    this.marker(map, lng, lat)

    // map.addControl(new mapboxgl.NavigationControl());

    geoJson.features.forEach(function (marker) {
      // console.log('marker', marker)
      if (marker.geometry) {
        // create a DOM element for the marker
        let el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.properties.icon.iconUrl})`
        el.style.width = marker.properties.icon.iconSize[0] + 'px';
        el.style.height = marker.properties.icon.iconSize[1] + 'px';
        el.style.backgroundRepeat = 'no-repeat';

        el.addEventListener('click', function () {
          // goto atraccion
          // window.alert(marker.properties.title);
          // callback(marker.properties.id)
          map.flyTo({
            center: marker.geometry.coordinates,
            zoom: 16
          });
        });

        let elementPopup = document.createElement('div');
        elementPopup.append(`${marker.properties.title}`)

        elementPopup.addEventListener('click', function () {
          // goto atraccion
          // window.alert(marker.properties.title);
          callback(marker.properties.id)
        });

        let popup = new mapboxgl.Popup(
          {
            offset: 25,
            className: 'popup-marker'
          }
        )
          // .setText(marker.properties.title)
          .setDOMContent(elementPopup)
          ;



        // add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(popup)
          .addTo(map);
      }

    });

  }

  drawCircuitos(elementId, lat = -27.3773499, lng = -55.8801476, geoJson, coordinates, modalidad, callback?) {
    console.log('geoJson', geoJson, this.mapa)

    // let map = this.mapa
    let map = new mapboxgl.Map({
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: this.mapStyle,
      center: [lng, lat],
      zoom: 12,
      // pitch: 45,
      // bearing: -17.6, 
      container: elementId,
      antialias: true,
      "transition": {
        "duration": 300,
        "delay": 0
      }
    });

    // map.addControl(new mapboxgl.NavigationControl());

    geoJson.features.forEach(function (marker) {
      console.log('marker', marker)
      if (marker.geometry) {
        // create a DOM element for the marker
        let el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${marker.properties.icon.iconUrl})`
        el.style.width = marker.properties.icon.iconSize[0] + 'px';
        el.style.height = marker.properties.icon.iconSize[1] + 'px';
        el.style.backgroundRepeat = 'no-repeat';

        el.addEventListener('click', function (e) {
          // goto atraccion
          // window.alert(marker.properties.title);
          // callback(marker.properties.id)
          map.flyTo({
            center: marker.geometry.coordinates,
            zoom: 16
          });
        });

        let elementPopup = document.createElement('div');
        elementPopup.append(`${marker.properties.title}`)

        elementPopup.addEventListener('click', function () {
          // goto atraccion
          // window.alert(marker.properties.title);
          callback(marker.properties.id)
        });

        let popup = new mapboxgl.Popup(
          {
            offset: 25,
            className: 'popup-marker'
          }
        )
          // .setText(marker.properties.title)
          .setDOMContent(elementPopup)
          ;



        // add marker to map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(popup)
          .addTo(map);
      }
    });

    console.log('coordinates', coordinates)

    this.getDirections(coordinates, modalidad).subscribe((result: any) => {
      console.log('getDirections', result)
      if (result.routes.length > 0) {
        let geometry = result.routes[0].geometry

        map.on('load', function () {
          console.log('onload geometry', geometry);
          map.addSource('route', {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              // 'geometry': {
              //   'type': 'LineString',
              //   'coordinates': coordinates
              // }
              'geometry': geometry
            }
          });
          map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#0000ff',
              // 'line-color': '#0071BB',
              'line-width': 7
            }
          });
        })
      }

    })

  }

  getDirections(coordinates, profile = 'driving') {

    // let coordinatesParams = [];

    // coordinates.forEach(item => {
    //   coordinatesParams.push
    // });

    let param = coordinates.join(";")

    console.log('coordinatesParams', param)

    let token = environment.mapbox
    let url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${param}?geometries=geojson&access_token=${token}`;
    return this.http.get(url).pipe();
  }
}
