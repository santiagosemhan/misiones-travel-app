import { ApiService } from './../_services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.page.html',
  styleUrls: ['./lugar.page.scss'],
})
export class LugarPage implements OnInit {

  @ViewChild('sliderImagen') public slider: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  lugar;
  lugarId;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.lugarId = this.route.snapshot.paramMap.get('id')

    console.log('this.lugarId', this.lugarId)

    this.apiService.get(`lugares/${this.lugarId}`).subscribe(
      (lugar) => {
        this.lugar = lugar
        console.log('lugar', lugar)
      });
  }

  toggleBackdrop(isVisible) {
    // this.backDropVisible = isVisible;
    // this.changeDetectorRef.detectChanges();
  }
  back() {
    this.router.navigate(['/home'])
  }

  verFoto($event) {
    console.log('verFoto', $event)
    this.slider.slideTo($event)
  }

}
