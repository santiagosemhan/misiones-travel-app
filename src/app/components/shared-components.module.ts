import { DrawerCircuitosComponent } from './drawer-circuitos/drawer-circuitos.component';
import { DrawerLugarComponent } from './drawer-lugar/drawer-lugar.component';
import { DrawerCategoriaComponent } from './drawer-categoria/drawer-categoria.component';
import { IonicModule } from '@ionic/angular';
import { DrawerComponent } from './drawer/drawer.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    DrawerComponent,
    DrawerCategoriaComponent,
    DrawerLugarComponent,
    DrawerCircuitosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
    DrawerComponent,
    DrawerCategoriaComponent,
    DrawerLugarComponent,
    DrawerCircuitosComponent
  ]
})
export class SharedComponentsModule { }
