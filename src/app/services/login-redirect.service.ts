import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class LoginRedirectService implements CanActivate {


  constructor(private auth: AuthService, private router: Router) { }
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
        this.auth.setMessage('');
        this.router.navigateByUrl('/login');
        return false;
    }
  }

}
