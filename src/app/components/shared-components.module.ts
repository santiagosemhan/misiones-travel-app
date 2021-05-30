import { ItemCuponComponent } from './item-cupon/item-cupon.component';
import { DrawerCircuitosComponent } from './drawer-circuitos/drawer-circuitos.component';
import { DrawerLugarComponent } from './drawer-lugar/drawer-lugar.component';
import { DrawerCategoriaComponent } from './drawer-categoria/drawer-categoria.component';
import { IonicModule } from '@ionic/angular';
import { DrawerComponent } from './drawer/drawer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DateFnsModule, FormatDistanceToNowPipeModule, ParseIsoPipeModule, ParsePipeModule } from 'ngx-date-fns';



@NgModule({
  declarations: [
    DrawerComponent,
    DrawerCategoriaComponent,
    DrawerLugarComponent,
    DrawerCircuitosComponent,
    ItemCuponComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    DateFnsModule,
    ParsePipeModule,
    ParseIsoPipeModule,
    FormatDistanceToNowPipeModule,
  ],
  exports: [
    DrawerComponent,
    DrawerCategoriaComponent,
    DrawerLugarComponent,
    DrawerCircuitosComponent,
    ItemCuponComponent
  ]
})
export class SharedComponentsModule { }
