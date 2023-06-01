import { Component,OnInit,ChangeDetectorRef  } from '@angular/core';
import { AlertController,LoadingController,ModalController } from '@ionic/angular';
import { SupabaseServiceService } from '../shares/services/supabase-service.service';
import { ModalCreateUserComponent } from '../shares/components/modal-create-user/modal-create-user.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(private loadingCtrl: LoadingController,private supabaseService:SupabaseServiceService,private modalCtrl:ModalController,private cdr: ChangeDetectorRef) {

  }
  usuarios:any=[];
  usuarios_filter:any=[];
  rol:any;

  async ngOnInit() {
    await this.getUsers();
    this.cdr.detectChanges();
  }
  async getUsers(){
   await  this.supabaseService.supabase.from('profiles').select('*,roles(nombre),municipios(nombre_municipio),estados(nombre_estado)').then((res:any)=>{

      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        element.municipio = element.municipios.nombre_municipio;
        element.estado = element.estados.nombre_estado;
        element.name = element.name + ' ' + element.f_name + ' ' +  element.m_name;
        element.rol = element.roles.nombre;

        this.usuarios.push(element);
        this.usuarios_filter.push(element);
      }

    }
    )
  }

  async openModal(){
    const modal = await this.modalCtrl.create({
      component: ModalCreateUserComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      let res:any = await this.supabaseService.signUp(data.email, data.password);
      if (res) {

        this.uploadProfileData(res.user.id, data);
      }

    }
  }

  async  uploadProfileData(userId: string, data: any) {
    try {
      let rol_value;
      if(data.rol){
        rol_value = 1;
      }else{
        rol_value = 2;
      }

      const { data: profile, error } = await this.supabaseService.supabase.from('profiles')
        .upsert({id:userId,name:data.name,f_name:data.f_name,m_name:data.m_name,id_estado:data.estado,id_municipio:data.municipio,rol:rol_value,fecha_nacimiento:data.fecha});

      if (error) {
        console.error('Error uploading profile data:', error);
      } else {
        console.log('Profile data uploaded successfully:', profile);
      }
    } catch (error) {
      console.error('Error uploading profile data:', error);
    }
  }


  async applyFilters() {
    if (this.rol === '' ) {
      this.usuarios_filter = this.usuarios;

    } else {
      this.usuarios_filter = this.usuarios.filter((user:any) => {

        const rolMatch = this.rol ? user.rol.toLowerCase().includes(this.rol.toLowerCase()) : true;

        return rolMatch;
      });
    }
  }


}
