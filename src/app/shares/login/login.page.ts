import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormControl,Validators,FormArray} from '@angular/forms';
import { SupabaseServiceService } from '../services/supabase-service.service';
import { Router } from '@angular/router';
import { AlertController,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder,
    private authService: SupabaseServiceService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {

  }
  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  ngOnInit() {}

  async login(){

    let tmp:any = this.credentials.value.email;
    let tmp2:any = this.credentials.value.password;

    this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
      showBackdrop: true
    }).then((loading) => {
      loading.present();

      this.authService.signIn(tmp,tmp2).then((res) => {
        loading.dismiss();
        console.log(res);
        this.router.navigateByUrl('/');
      }).catch((err) => {
        loading.dismiss();
        this.alertCtrl.create({
          header: 'Error',
          message: err.message,
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
        });
      });
    }
    );


  }
}
