import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {FormBuilder,FormControl,Validators,FormArray} from '@angular/forms';
import { SupabaseServiceService } from '../../services/supabase-service.service';
@Component({
  selector: 'app-modal-edit-user',
  templateUrl: './modal-edit-user.component.html',
  styleUrls: ['./modal-edit-user.component.scss'],
})
export class ModalEditUserComponent  implements OnInit {
  data = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    m_name: ['', [Validators.required, Validators.minLength(3)]],
    f_name: ['', [Validators.required, Validators.minLength(3)]],
    rol: [true],

  });
  constructor(private navParams: NavParams,private fb: FormBuilder,private modalCtrl: ModalController,private supabase:SupabaseServiceService) {
    const user_info = this.navParams.get('user_info');

    if(user_info){

      this.data.controls.name.setValue(user_info.name);
      this.data.controls.m_name.setValue(user_info.m_name);
      this.data.controls.f_name.setValue(user_info.f_name);
      if(user_info.rol == 1){
        this.data.controls.rol.setValue(true);
      }else{
        this.data.controls.rol.setValue(false);
      }

    }
   }
   get name() {
    return this.data.controls.name;
  }
  get m_name() {
    return this.data.controls.m_name;
  }
  get f_name() {
    return this.data.controls.f_name;
  }
  get rol() {
    return this.data.controls.rol;
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
