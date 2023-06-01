import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl,Validators,FormArray} from '@angular/forms';
import { SupabaseServiceService } from '../../services/supabase-service.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-create-user',
  templateUrl: './modal-create-user.component.html',
  styleUrls: ['./modal-create-user.component.scss'],
})
export class ModalCreateUserComponent  implements OnInit {
  municipios: any = [];
  estados: any = [];
  data = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    m_name: ['', [Validators.required, Validators.minLength(3)]],
    f_name: ['', [Validators.required, Validators.minLength(3)]],
    municipio: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    rol: [true],
    fecha: ['',[Validators.required]],
  });

  constructor(private fb: FormBuilder,private modalCtrl: ModalController,private supabase:SupabaseServiceService) { }
  get email() {
    return this.data.controls.email;
  }
  get confirmPassword() {
    return this.data.controls.confirmPassword;
  }
  get password() {
    return this.data.controls.password;
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
  get municipio() {
    return this.data.controls.municipio;
  }
  get estado() {
    return this.data.controls.estado;
  }
  get rol() {
    return this.data.controls.rol;
  }

  async ngOnInit() {
    await this.getEstados();

  }
  handleChange(e:any) {
    this.getMunicipios(e.target.value);
  }
  async getMunicipios(id:any){
    await this.supabase.supabase.from('municipios').select('*').eq('id_estado',id).then(res=>{
      this.municipios = res.data;
    }
    );
  }

  async getEstados(){
    await this.supabase.supabase.from('estados').select('*').then(res=>{
      this.estados = res.data;

    });

  }

  confirm(){

    return this.modalCtrl.dismiss(this.data.value, 'confirm');
  }

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  save(){
  }
}
