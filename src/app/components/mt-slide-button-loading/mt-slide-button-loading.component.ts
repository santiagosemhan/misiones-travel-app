import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mt-slide-button-loading',
  templateUrl: './mt-slide-button-loading.component.html',
  styleUrls: ['./mt-slide-button-loading.component.scss'],
})
export class MtSlideButtonLoadingComponent implements OnInit {
@Input() slideOpts;

  constructor() { }

  ngOnInit() {}

  arrayOne(n: number): any[] {
    return Array(n);
  }

}
