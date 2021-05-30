import { Component, Input, OnInit } from '@angular/core';
import { formatDistance, subDays, format, parseISO } from 'date-fns'

@Component({
  selector: 'mt-item-cupon',
  templateUrl: './item-cupon.component.html',
  styleUrls: ['./item-cupon.component.scss'],
})
export class ItemCuponComponent implements OnInit {

  @Input() evento;
  @Input() background;

  constructor() { }

  ngOnInit() { }

}
