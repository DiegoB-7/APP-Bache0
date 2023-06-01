import { AfterViewInit, Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import Swiper, { Autoplay, Navigation } from 'swiper';
import { AlertController,LoadingController } from '@ionic/angular';
import { SupabaseServiceService } from '../shares/services/supabase-service.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public chart: any;
  public chart1: any;
  public chart2: any;
  public users:any =[];
  public reportes:any =[];
  constructor(private loadingCtrl: LoadingController,private supabase:SupabaseServiceService,private router:Router) {}
  goUsers(){
    this.router.navigateByUrl('/tabs/tab2');
  }
  goReportes(){
    this.router.navigateByUrl('/tabs/tab3');
  }
  async presentLoading() {

  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  async ionViewWillEnter(){
   this.loadingCtrl.create({

      message: 'Cargando...',
      spinner: 'crescent',
      animated: true,
      mode: 'ios',
    }).then( async loading => {
      loading.present();
      if(this.chart){
        this.destroyChart();
       }
       await this.createChart();

        Swiper.use([Autoplay, Navigation]);

        const swiper = new Swiper('.swiper-container', {
          autoplay: {
            delay: 3000, // Set the delay between slides in milliseconds
            disableOnInteraction: false // Continue autoplay even on user interaction
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        });
        loading.dismiss();
      });
  }
    ngOnInit() {


  }

destroyChart(){
  this.chart.destroy();
  this.chart1.destroy();
  this.chart2.destroy();
}
  async createChart(){

    let arreglados:any ;
    let sin_arregar:any ;
    let users:any;
    await this.supabase.supabase.from('registrosbaches').select('*,municipios(nombre_municipio),estados(nombre_estado)', { count: 'exact' }).then((res:any)=>{
      this.reportes = res.data;
      console.log(this.reportes);
    });
    await this.supabase.supabase.from('registrosbaches').select('*', { count: 'exact' }).eq('estatusid',1).then((res:any)=>{
      arreglados = res.data.length;

    });
    await this.supabase.supabase.from('registrosbaches').select('*', { count: 'exact' }).eq('estatusid',2).then((res:any)=>{
      sin_arregar = res.data.length;
    });
    await this.supabase.supabase.from('profiles').select('*,roles(nombre)').then((res:any)=>{
      users = res.data;
    });
    for(let i = 0; i < users.length; i++){
      await this.supabase.supabase.from('registrosbaches').select('*', { count: 'exact' }).eq('id_usuario',users[i].id).then((res:any)=>{
        users[i].registros = res.data.length;
      });
    }
    this.users = users;
    console.log(users);

    this.chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart
      data: {// values on X-Axis

        datasets: [
          {
            label: "Arreglados",
            data: [arreglados],
            backgroundColor: 'blue'
          },
          {
            label: "Sin arreglar",
            data: [sin_arregar],
            backgroundColor: 'limegreen'
          }



        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio:2.5
      }
    });
    let names: any = users.map((user: any) => user.name + ' ' + user.f_name + ' ' + user.m_name);
    let registros: any = users.map((user: any) => user.registros);

this.chart1 = new Chart("MyChart1", {
  type: 'bar',
  data: {
    labels: names,
    datasets: [{
      label: 'Registros',
      data: registros,
      backgroundColor: 'blue'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2.5
  }
});

    this.chart2 = new Chart("MyChart2", {
      type: 'bar', //this denotes tha type of chart

      data:{
        labels: ['Reportes'],
        datasets: [
          {
            label: "Arreglados",
            data: [arreglados],
            backgroundColor: 'blue'
          },
          {
            label: "Sin arreglar",
            data: [sin_arregar],
            backgroundColor: 'limegreen'
          }
        ]
      }

    });
  }

}
