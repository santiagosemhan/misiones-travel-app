import { SharedComponentsModule } from './../components/shared-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import { DateFnsModule, FormatDistanceToNowPipeModule, ParseIsoPipeModule, ParsePipeModule } from 'ngx-date-fns';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventosPageRoutingModule,
    DateFnsModule,
    ParsePipeModule,
    ParseIsoPipeModule,
    FormatDistanceToNowPipeModule,
    TranslateModule,
    SharedComponentsModule
  ],
  declarations: [EventosPage]
})
export class EventosPageModule {}
