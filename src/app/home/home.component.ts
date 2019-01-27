import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {EnsureAuthenticatedService} from '../services/ensure-authenticated.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  email: string;
  showLogin = true;
  imageUrl = environment.imageUrl;

  @Output() clickedLogin = new EventEmitter<boolean>();

  constructor(private auth: AuthService, private ensureAuth: EnsureAuthenticatedService) { }

  ngOnInit() {
    this.auth.loggedIn.subscribe(value => {
      this.showLogin = !value;
      if (value) {
        this.email = localStorage.getItem('token');
      }
    });
  }

  showLoginModal() {
    this.ensureAuth.showLoginModal.next(true);
  }

  changePage(page) {
    this.auth.currentPage.next(page);
  }

  logoutUser() {
    localStorage.clear();
    this.changePage('home');
    this.auth.loggedIn.next(false);
  }
}
