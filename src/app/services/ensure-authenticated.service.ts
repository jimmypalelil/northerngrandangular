import {Injectable, Input} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class EnsureAuthenticatedService implements CanActivate {
  showLoginModal = new Subject<boolean>();

  constructor(private auth: AuthService, private router: Router) {

  }

  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('token') === 'reservations@northerngrand.ca') {
        this.auth.setMessage('Access to Housekeeping Only');
        // this.router.navigateByUrl('/login');
        this.showLoginModal.next(true);
        return false;
      } else  {
        this.auth.setMessage('');
        this.auth.loggedIn.next(true);
        return true;
      }
    }  else {
      this.auth.setMessage('');
      // this.router.navigateByUrl('/login');
      this.showLoginModal.next(true);
      return false;
    }
  }

}
