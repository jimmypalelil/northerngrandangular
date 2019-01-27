import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Subject} from 'rxjs';

@Injectable()
export class EnsureAuthenticatedService implements CanActivate {
  showLoginModal = new Subject<boolean>();

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      this.auth.setMessage('');
      this.auth.loggedIn.next(true);
      return true;
    }  else {
      this.auth.setMessage('');
      this.showLoginModal.next(true);
      return false;
    }
  }

}
