import { SharedComponentsModule } from './../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CircuitosPageRoutingModule } from './circuitos-routing.module';

import { CircuitosPage } from './circuitos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CircuitosPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [CircuitosPage]
})
export class CircuitosPageModule {}
