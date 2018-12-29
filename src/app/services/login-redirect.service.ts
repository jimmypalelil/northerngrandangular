import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';
import {EnsureAuthenticatedService} from './ensure-authenticated.service';

@Injectable()
export class LoginRedirectService implements CanActivate {


  constructor(private auth: AuthService, private router: Router, private ensureAuth: EnsureAuthenticatedService) { }
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      return true;
    } else {
        this.auth.setMessage('');
        this.ensureAuth.showLoginModal.next(true);
        return false;
    }
  }

}
