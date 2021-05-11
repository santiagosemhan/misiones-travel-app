import { SharedComponentsModule } from './../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LugarPageRoutingModule } from './lugar-routing.module';

import { LugarPage } from './lugar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LugarPageRoutingModule,
    SharedComponentsModule
  ],
  declarations: [LugarPage]
})
export class LugarPageModule {}
