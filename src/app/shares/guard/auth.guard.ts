import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router  } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseServiceService } from '../services/supabase-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseServiceService, private router: Router) { }
  canActivate(): any {
    this.supabaseService.getSession().then((res:any) => {

      if (res.data.session) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    }
    ).catch((err) => {
      this.router.navigateByUrl('/login');
      return false;
    }
    );


  }

}
