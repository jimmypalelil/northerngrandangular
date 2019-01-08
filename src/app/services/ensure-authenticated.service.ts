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
      if (localStorage.getItem('token') === 'reservations@northerngrand.ca') {
        this.auth.setMessage('Access to Housekeeping Only');
        this.showLoginModal.next(true);
        return false;
      } else  {
        this.auth.setMessage('');
        this.auth.loggedIn.next(true);
        return true;
      }
    }  else {
      this.auth.setMessage('');
      this.showLoginModal.next(true);
      return false;
    }
  }

}
