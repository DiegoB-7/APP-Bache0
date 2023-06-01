import { Component, OnInit } from '@angular/core';
import { AlertController,LoadingController } from '@ionic/angular';
import { SupabaseServiceService } from '../shares/services/supabase-service.service';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  historial: any = [];
  constructor(private loadingCtrl: LoadingController,private supabaseService:SupabaseServiceService) {}

  ngOnInit() {
  }
  async ionViewWillEnter() {
    await this.supabaseService.supabase.from('triggerlog').select('*').then((res: any) => {
      this.historial = res.data;
      console.log(this.historial);
    }
    )
  }
}
