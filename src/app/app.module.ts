import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms'
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import 'chart.js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalCreateUserComponent } from './shares/components/modal-create-user/modal-create-user.component';
import { ModalCreateBacheComponent } from './shares/components/modal-create-bache/modal-create-bache.component';
import { ModalEditUserComponent } from './shares/components/modal-edit-user/modal-edit-user.component';
import { ModalEditBacheComponent } from './shares/components/modal-edit-bache/modal-edit-bache.component';
@NgModule({
  declarations: [AppComponent,ModalCreateUserComponent,ModalCreateBacheComponent,ModalEditUserComponent,ModalEditBacheComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ReactiveFormsModule,FormsModule ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
