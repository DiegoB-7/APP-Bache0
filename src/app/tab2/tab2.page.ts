import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { SupabaseServiceService } from '../shares/services/supabase-service.service';
import { ModalCreateUserComponent } from '../shares/components/modal-create-user/modal-create-user.component';
import { ModalEditUserComponent } from '../shares/components/modal-edit-user/modal-edit-user.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private supabaseService: SupabaseServiceService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {}
  user: any;
  usuarios: any = [];
  usuarios_filter: any = [];
  rol: any;
  ionViewWillEnter() {
    this.supabaseService.getSession().then((res: any) => {
      if (res.data.session) {
        this.supabaseService.supabase
          .from('profiles')
          .select(
            '*,roles(nombre),municipios(nombre_municipio),estados(nombre_estado)'
          )
          .eq('id', res.data.session.user.id)
          .then((res: any) => {
            this.user = res.data[0];
          });
      } else {
        this.router.navigateByUrl('/login');
      }
    });
    this.getUsers();
    this.cdr.detectChanges();
  }
  ngOnInit(): void {}

  async getUsers() {
    await this.supabaseService.supabase
      .from('profiles')
      .select(
        '*,roles(nombre),municipios(nombre_municipio),estados(nombre_estado)'
      )
      .then((res: any) => {
        this.usuarios = [];
        this.usuarios_filter = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          element.municipio = element.municipios.nombre_municipio;
          element.estado = element.estados.nombre_estado;
          element.name =
            element.name + ' ' + element.f_name + ' ' + element.m_name;
          element.rol = element.roles.nombre;

          this.usuarios.push(element);
          this.usuarios_filter.push(element);
        }
      });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalCreateUserComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      let res: any = await this.supabaseService.signUp(
        data.email,
        data.password
      );
      if (res) {
        this.uploadProfileData(res.user.id, data);
      }
    }
  }
  async edit(id: any) {
    let user_info: any;
    this.supabaseService.supabase
      .from('profiles')
      .select(
        '*,roles(nombre),municipios(nombre_municipio),estados(nombre_estado)'
      )
      .eq('id', id)
      .then((res: any) => {
        user_info = res.data[0];
      });

    if (this.user.rol != 1) {
      this.alertCtrl
        .create({
          header: 'No tienes permisos',
          message: 'No tienes permisos para editar este usuario',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: () => {
                console.log('Edit Cancelled');
              },
            },
          ],
        })
        .then((alert) => alert.present());
    } else {
      this.alertCtrl
        .create({
          header: 'Editar usuario',
          message: '¿Estás seguro de editar este usuario?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Edit Cancelled');
              },
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.openModalEdit(user_info);
              },
            },
          ],
        })
        .then((alert) => alert.present());
    }
  }
  async openModalEdit(user_info: any) {
    const modal = await this.modalCtrl.create({
      component: ModalEditUserComponent,
      componentProps: {
        user_info: user_info,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.uploadUser(user_info.id, data);
    }
  }
  async delete(id: any) {
    if (this.user.rol != 1) {
      this.alertCtrl
        .create({
          header: 'No tienes permisos',
          message: 'No tienes permisos para editar este usuario',
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel',
              handler: () => {
                console.log('Edit Cancelled');
              },
            },
          ],
        })
        .then((alert) => alert.present());
    } else {
      this.alertCtrl
        .create({
          header: 'Eliminar usuario',
          message: '¿Estás seguro de eliminar este usuario?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Delete Cancelled');
              },
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.supabaseService.supabase
                  .from('profiles')
                  .delete()
                  .match({ id: id })
                  .then((res: any) => {
                    this.getUsers();
                  });
              },
            },
          ],
        })
        .then((alert) => alert.present());
    }
  }
  async uploadUser(userID: any, data: any) {
    try {
      let rol_value;
      if (data.rol) {
        rol_value = 1;
      } else {
        rol_value = 2;
      }
      const { data: profile, error } = await this.supabaseService.supabase
        .from('profiles')
        .upsert({
          id: userID,
          name: data.name,
          f_name: data.f_name,
          m_name: data.m_name,
          rol: rol_value,
        });
      if (error) {
        console.log(error);
      } else {
        this.getUsers();
        console.log('Profile data uploaded successfully:', profile);
      }
    } catch (error) {
      console.error('Error uploading profile data:', error);
    }
  }
  async uploadProfileData(userId: string, data: any) {
    try {
      let rol_value;
      if (data.rol) {
        rol_value = 1;
      } else {
        rol_value = 2;
      }

      const { data: profile, error } = await this.supabaseService.supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: data.name,
          f_name: data.f_name,
          m_name: data.m_name,
          id_estado: data.estado,
          id_municipio: data.municipio,
          rol: rol_value,
          fecha_nacimiento: data.fecha,
        });

      if (error) {
        console.error('Error uploading profile data:', error);
      } else {
        this.getUsers();
        console.log('Profile data uploaded successfully:', profile);
      }
    } catch (error) {
      console.error('Error uploading profile data:', error);
    }
  }

  async applyFilters() {
    if (this.rol === '') {
      this.usuarios_filter = this.usuarios;
    } else {
      this.usuarios_filter = this.usuarios.filter((user: any) => {
        const rolMatch = this.rol
          ? user.rol.toLowerCase().includes(this.rol.toLowerCase())
          : true;

        return rolMatch;
      });
    }
  }
}
