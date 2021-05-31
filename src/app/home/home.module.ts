import { SharedComponentsModule } from './../components/shared-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { AutoCompleteModule } from 'ionic4-auto-complete';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
