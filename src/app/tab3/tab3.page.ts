import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseServiceService } from '../shares/services/supabase-service.service';
import { ModalCreateBacheComponent } from '../shares/components/modal-create-bache/modal-create-bache.component';
import { ModalEditBacheComponent } from '../shares/components/modal-edit-bache/modal-edit-bache.component';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  baches: any = [];
  baches_filter: any = [];
  estatus: any;
  user: any;
  constructor(
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private supabaseService: SupabaseServiceService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.supabaseService
      .getSession()
      .then((res: any) => {
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
      })
      .catch((err) => {
        this.router.navigateByUrl('/login');
      });
    this.getBaches();
    this.cdr.detectChanges();
  }
  ngOnInit() {}
  edit(id: any) {
    this.alertController
      .create({
        header: 'Editar reporte',
        message: '¿Estás seguro de que quieres editar este reporte?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Logout Cancelled');
            },
          },
          {
            text: 'Aceptar',
            handler: async () => {
              this.openModalEdit(id);
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
  async openModalEdit(id: any) {
    let bache_info: any;
    await this.supabaseService.supabase
      .from('registrosbaches')
      .select('*')
      .eq('id', id)
      .then((res: any) => {
        bache_info = res.data[0];
      });

    const modal = await this.modalCtrl.create({
      component: ModalEditBacheComponent,
      componentProps: {
        bache_info: bache_info,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.uploadBache(id, data);
    }
  }
  async uploadBache(id: any, data: any) {
    console.log(data);
    await this.supabaseService.supabase
      .from('registrosbaches')
      .upsert({
        id: id,
        calle: data.calle,
        numeroexterior: data.numeroexterior,
        numerointerior: data.numerointerior,
        colonia: data.colonia,
        cp: data.cp,
        estatusid: data.estatus,
        comentario: data.comentario,
      })
      .then(async (res: any) => {
        var bache_tmp: any;
        await this.supabaseService.supabase
          .from('registrosbaches')
          .select('*,municipios(nombre_municipio),estados(nombre_estado)')
          .eq('id', id)
          .then((res: any) => {
            bache_tmp = res.data[0];

          });

        this.supabaseService.supabase
          .from('triggerlog')
          .insert({
            user:
              this.user.id +
              ' ' +
              this.user.name +
              ' ' +
              this.user.f_name +
              ' ' +
              this.user.m_name,
              report:
              bache_tmp.calle +
              ' ' +
              bache_tmp.colonia +
              ' ' +
              bache_tmp.numeroexterior +
              ' ' +
              bache_tmp.cp +
              ' ' +
              bache_tmp.estados.nombre_estado +
              ', ' +
              bache_tmp.municipios.nombre_municipio +
              ' ' +
              bache_tmp.fecharegistro,
            action: 'Editó un reporte',
          })
          .then((res: any) => {
            this.getBaches();
          });
      });
  }
  delete(id: any) {

    this.alertController
      .create({
        header: 'Eliminar reporte',
        message: '¿Estás seguro de que quieres eliminar este reporte?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Logout Cancelled');
            },
          },
          {
            text: 'Aceptar',
            handler: async () => {
              var bache_tmp: any;
              await this.supabaseService.supabase
                .from('registrosbaches')
                .select('*,municipios(nombre_municipio),estados(nombre_estado)')
                .eq('id', id)
                .then((res: any) => {
                  bache_tmp = res.data[0];

                });
              await this.supabaseService.supabase
                .from('triggerlog')
                .insert({
                  user:
                    this.user.id +
                    ' ' +
                    this.user.name +
                    ' ' +
                    this.user.f_name +
                    ' ' +
                    this.user.m_name,
                  report:
                    bache_tmp.calle +
                    ' ' +
                    bache_tmp.colonia +
                    ' ' +
                    bache_tmp.numeroexterior +
                    ' ' +
                    bache_tmp.cp +
                    ' ' +
                    bache_tmp.estados.nombre_estado +
                    ', ' +
                    bache_tmp.municipios.nombre_municipio +
                    ' ' +
                    bache_tmp.fecharegistro,
                  action: 'Eliminó un reporte',
                })
                .then((res: any) => {
                  this.getBaches();
                });
                 this.supabaseService.supabase
                .from('registrosbaches')
                .delete()
                .match({ id: id })
                .then((res: any) => {
                  this.getBaches();
                });
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
  getBaches() {
    this.baches = [];
    this.baches_filter = [];
    this.supabaseService.supabase
      .from('registrosbaches')
      .select(
        '*,municipios(nombre_municipio),estados(nombre_estado),estatus(nombre)'
      )
      .then((res: any) => {
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          element.estatus = element.estatus.nombre;
          element.municipio =
            element.estados.nombre_estado +
            ', ' +
            element.municipios.nombre_municipio;
          element.estado = element.estados.nombre_estado;
          if (element.comentario === null) {
            element.comentario = 'Sin comentarios';
          }

          if (element.numerointerior !== null) {
            element.calle =
              element.colonia +
              ' ' +
              element.calle +
              ' ' +
              element.numeroexterior +
              ' ' +
              element.numerointerior +
              ' #' +
              element.cp;
          } else {
            element.calle =
              element.colonia +
              ' ' +
              element.calle +
              ' ' +
              element.numeroexterior +
              ' #' +
              element.cp;
          }

          this.baches.push(element);
          this.baches_filter.push(element);
        }

      });
  }

  async applyFilters() {
    if (this.estatus === '') {
      this.baches_filter = this.baches;
    } else {
      this.baches_filter = this.baches.filter((bache: any) => {
        const rolMatch = this.estatus
          ? bache.estatus.toLowerCase().includes(this.estatus.toLowerCase())
          : true;

        return rolMatch;
      });
    }
  }
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalCreateBacheComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      await this.supabaseService.supabase
        .from('registrosbaches')
        .insert([
          {
            colonia: data.colonia,
            calle: data.calle,
            numeroexterior: data.numeroexterior,
            numerointerior: data.numerointerior,
            comentario: data.comentario,
            fecharegistro: data.fecha,
            cp: data.cp,
            id_municipio: data.municipio,
            id_estado: data.estado,
            id_usuario: this.user.id,
          },
        ])
        .then( async (res: any) => {
          const { data, error } = await this.supabaseService.supabase
      .from('registrosbaches')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
      if(data){
        var bache_tmp = data.id;
      }

           await this.supabaseService.supabase
             .from('registrosbaches')
             .select('*,municipios(nombre_municipio),estados(nombre_estado)')
             .eq('id', bache_tmp)
             .then((res: any) => {
               bache_tmp = res.data[0];

             });
           this.supabaseService.supabase
             .from('triggerlog')
             .insert({
               user:
                 this.user.id +
                 ' ' +
                 this.user.name +
                 ' ' +
                 this.user.f_name +
                 ' ' +
                 this.user.m_name,
                 report:
                 bache_tmp.calle +
                 ' ' +
                 bache_tmp.colonia +
                 ' ' +
                 bache_tmp.numeroexterior +
                 ' ' +
                 bache_tmp.cp +
                 ' ' +
                 bache_tmp.estados.nombre_estado +
                 ', ' +
                 bache_tmp.municipios.nombre_municipio +
                 ' ' +
                 bache_tmp.fecharegistro,
               action: 'Creó un reporte',
             })
             .then((res: any) => {
               this.getBaches();
             });
        });
    }
  }
}
