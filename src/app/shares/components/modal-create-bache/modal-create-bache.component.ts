import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl,Validators,FormArray} from '@angular/forms';
import { SupabaseServiceService } from '../../services/supabase-service.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal-create-bache',
  templateUrl: './modal-create-bache.component.html',
  styleUrls: ['./modal-create-bache.component.scss'],
})
export class ModalCreateBacheComponent  implements OnInit {
  data = this.fb.nonNullable.group({
    colonia: ['', [Validators.required, Validators.minLength(3)]],
    calle: ['', [Validators.required, Validators.minLength(3)]],
    numeroexterior: ['', [Validators.required, Validators.minLength(3)]],
    numerointerior: [''],
    estado: ['', [Validators.required]],
    municipio: ['', [Validators.required]],
    cp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    comentario: [''],

    fecha: ['',[Validators.required]],
  });
  constructor(private fb: FormBuilder,private modalCtrl: ModalController,private supabase:SupabaseServiceService) { }
  municipios: any = [];
  estados: any = [];
  async ngOnInit() {
    await this.getEstados();
  }

  get colonia() {
    return this.data.controls.colonia;
  }
  get calle() {
    return this.data.controls.calle;
  }
  get numeroexterior() {
    return this.data.controls.numeroexterior;
  }
  get numerointerior() {
    return this.data.controls.numerointerior;
  }
  get estado() {
    return this.data.controls.estado;
  }
  get municipio() {
    return this.data.controls.municipio;
  }
  get cp() {
    return this.data.controls.cp;
  }
  get comentario() {
    return this.data.controls.comentario;
  }
  get fecha() {
    return this.data.controls.fecha;
  }



  confirm(){

    return this.modalCtrl.dismiss(this.data.value, 'confirm');
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
  save(){
  }
  handleChange(e:any) {
    this.getMunicipios(e.target.value);
  }
  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
