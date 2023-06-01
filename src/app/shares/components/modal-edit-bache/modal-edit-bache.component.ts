import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {FormBuilder,FormControl,Validators,FormArray} from '@angular/forms';
import { SupabaseServiceService } from '../../services/supabase-service.service';

@Component({
  selector: 'app-modal-edit-bache',
  templateUrl: './modal-edit-bache.component.html',
  styleUrls: ['./modal-edit-bache.component.scss'],
})
export class ModalEditBacheComponent  implements OnInit {
  data = this.fb.nonNullable.group({
    calle: ['', [Validators.required, Validators.minLength(3)]],
    colonia: ['', [Validators.required, Validators.minLength(3)]],
    numeroexterior: ['', [Validators.required, Validators.minLength(3)]],
    numerointerior: [''],
    cp: ['', [Validators.required, Validators.minLength(3)]],
    comentario: [''],
    estatus:[true],

  });
  constructor(private navParams: NavParams,private fb: FormBuilder,private modalCtrl: ModalController,private supabase:SupabaseServiceService) {
    const bache_info = this.navParams.get('bache_info');

    if(bache_info){

      this.data.controls.calle.setValue(bache_info.calle);
      this.data.controls.colonia.setValue(bache_info.colonia);
      this.data.controls.numeroexterior.setValue(bache_info.numeroexterior);
      this.data.controls.numerointerior.setValue(bache_info.numerointerior);
      this.data.controls.cp.setValue(bache_info.cp);
      this.data.controls.comentario.setValue(bache_info.comentario);
      this.data.controls.estatus.setValue(bache_info.estatus);
    }
   }
   get calle() {
    return this.data.controls.calle;
  }
  get colonia() {
    return this.data.controls.colonia;
  }
  get numeroexterior() {
    return this.data.controls.numeroexterior;
  }
  get numerointerior() {
    return this.data.controls.numerointerior;
  }
  get cp() {
    return this.data.controls.cp;
  }
  get comentario() {
    return this.data.controls.comentario;
  }
  get estatus() {
    return this.data.controls.estatus;
  }
  ngOnInit() {}

  confirm(){

    return this.modalCtrl.dismiss(this.data.value, 'confirm');
  }

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  save(){
  }
}
