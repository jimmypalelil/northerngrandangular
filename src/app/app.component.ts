import {Component, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './models/user';
import {EnsureAuthenticatedService} from './services/ensure-authenticated.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService, private ensureAuth: EnsureAuthenticatedService) {}
  title = 'app';
  currentPage: string;
  loginFormModalEmail = new FormControl('', Validators.email);
  loginFormModalPassword = new FormControl('', Validators.required);
  loggedIn: boolean;
  email: string;

  @ViewChild('frame') modalFrame;

  changePage(page) {
    this.currentPage = page;
  }

  ngOnInit() {
    this.ensureAuth.canActivate();
    this.currentPage = 'home';
    this.loggedIn = !!localStorage.getItem('token');
    if (this.loggedIn) {
      this.email = localStorage.getItem('token');
    }
    this.auth.loggedIn.subscribe(value => {
      this.loggedIn = value;
    });
    this.auth.currentPage.subscribe(value => {
      this.currentPage = value;
    });
  }

  showModal() {
    this.modalFrame.show();
  }

  loginUser() {
    const user = new User(this.loginFormModalEmail.value, this.loginFormModalPassword.value);
    this.auth.login(user).then( data => {
      if (data['email']) {
        this.email = data['email'];
        localStorage.setItem('token', data['email']);
        this.auth.loggedIn.next(true);
        this.router.navigateByUrl('/');
        this.changePage('home');
      }
    });
  }

  logoutUser() {
    localStorage.clear();
    this.changePage('home');
    this.auth.loggedIn.next(false);
  }
}
