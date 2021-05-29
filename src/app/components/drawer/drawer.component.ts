import { GestureController, Platform } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements AfterViewInit {

  @ViewChild('drawer', { read: ElementRef }) drawer: ElementRef;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();
  @Output('btnClick') btnClick: EventEmitter<boolean> = new EventEmitter();
  @Output('btnRoute') btnRoute: EventEmitter<boolean> = new EventEmitter();
  // @Input() categorias;
  isOpen = false;
  openHeight = 0;



  constructor(private platform: Platform, private gestureCtrl: GestureController) {


  }

  async ngAfterViewInit() {

    const drawer = this.drawer.nativeElement;
    this.openHeight = (this.platform.height() / 100) * 30;
    // console.log('openHeight', this.openHeight)
    const gesture = await this.gestureCtrl.create({
      el: drawer,
      gestureName: 'swipe',
      direction: 'y',
      onStart: () => {
        drawer.style.transition = 'none';
      },
      onMove: evt => {
        // console.log('onMove', evt)
        if (evt.deltaY < -this.openHeight) {
          return;
        }
        drawer.style.transform = `translateY(${evt.deltaY}px)`

      },
      onEnd: evt => {
        // console.log('onEnd', evt)
        if (evt.deltaY < -30 && !this.isOpen) {
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = `translateY(${-this.openHeight}px)`;
          this.openState.emit(true);
          this.isOpen = true;
        }
        else if (evt.deltaY > 30 && this.isOpen) {
          drawer.style.transition = '.4s ease-out';
          drawer.style.transform = '';
          this.openState.emit(false);
          this.isOpen = false;
        }
      }
    });
    gesture.enable(true);
  }

  toggleDrawer() {
    const drawer = this.drawer.nativeElement;
    this.openState.emit(!this.isOpen);

    if (!this.isOpen) {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = '';
      this.isOpen = false;
    } else {
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = `translateY(${-this.openHeight}px)`;
      this.isOpen = true;
    }
  }

  isCategoriaDisabled(categoria) {
    // let cat = this.categorias.filter(function (iCat) {
    //   return iCat.slug === categoria;
    // })[0]

    // return !cat.activo;

  }

  btnCategoria(categoria) {
    this.btnClick.emit(categoria);
  }

  btnAlojamiento(){    
    window.open('https://www.booking.com/searchresults.es.html?label=gen173nr-1DCAQoggI49ANIClgEaAyIAQGYAQq4AQfIAQzYAQPoAQH4AQKIAgGoAgO4ArGLxYUGwAIB0gIkZjgwYzFjMjItZmE4NS00MTYzLTg1MmItMGE3NzdjMDFmY2Y42AIE4AIB&lang=es&sid=417c416c913aa1aba59183ddc9486c8f&sb=1&src=searchresults&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Fsearchresults.es.html%3Flabel%3Dgen173nr-1DCAQoggI49ANIClgEaAyIAQGYAQq4AQfIAQzYAQPoAQH4AQKIAgGoAgO4ArGLxYUGwAIB0gIkZjgwYzFjMjItZmE4NS00MTYzLTg1MmItMGE3NzdjMDFmY2Y42AIE4AIB%3Bsid%3D417c416c913aa1aba59183ddc9486c8f%3Btmpl%3Dsearchresults%3Bclass_interval%3D1%3Bdtdisc%3D0%3Bgroup_adults%3D2%3Binac%3D0%3Bindex_postcard%3D0%3Blabel_click%3Dundef%3Boffset%3D0%3Bpostcard%3D0%3Bsb_price_type%3Dtotal%3Bshw_aparth%3D1%3Bslp_r_match%3D0%3Bsrpvid%3D61408998471002c8%3Bss_all%3D0%3Bssb%3Dempty%3Bsshis%3D0%3Btop_ufis%3D1%3Bsig%3Dv155UWYH4s%3B&ss=Misiones%2C+Argentina&is_ski_area=&checkin_year=&checkin_month=&checkout_year=&checkout_month=&group_adults=2&group_children=0&no_rooms=1&from_sf=1&ss_raw=misiones&ac_position=0&ac_langcode=es&ac_click_type=b&dest_id=1343&dest_type=region&place_id_lat=-26.255421&place_id_lon=-54.893287&search_pageview_id=61408998471002c8&search_selected=true&region_type=province&search_pageview_id=61408998471002c8&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&sb_changed_destination=1', '_system');
  }

  goTo(path) {
    this.btnRoute.emit(path);
  }
}
