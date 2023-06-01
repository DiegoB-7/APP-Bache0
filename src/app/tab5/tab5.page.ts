import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SupabaseServiceService } from '../shares/services/supabase-service.service';
import { ModalController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  name: string = 'John Doe';
  birthday: Date = new Date(1990, 7, 15);
  location: string = 'New York, USA';
  role: string = 'Administrator';
  constructor(private alertController:AlertController,private supabaseService:SupabaseServiceService,private router:Router) { }

  ngOnInit() {

    this.supabaseService.getSession().then((res:any)=>{
      if(res.data.session){
        this.supabaseService.supabase.from('profiles').select('*,roles(nombre),municipios(nombre_municipio),estados(nombre_estado)').eq('id',res.data.session.user.id).then((res:any)=>{
          this.name = res.data[0].name + ' ' + res.data[0].f_name + ' ' + res.data[0].m_name;
          this.birthday = res.data[0].fecha_nacimiento;
          this.location = res.data[0].municipios.nombre_municipio + ', ' + res.data[0].estados.nombre_estado;
          this.role = res.data[0].roles.nombre;
        }
        )

      }else{
        this.router.navigateByUrl('/login');
      }
    }
    ).catch((err)=>{
      this.router.navigateByUrl('/login');
    }
    );



  }

  logout(){
    this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Logout Cancelled');
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {
            await this.supabaseService.supabase.auth.signOut();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    }).then((alert) => alert.present());


  }
}
