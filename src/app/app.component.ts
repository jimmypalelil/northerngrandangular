import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgForm, FormControl, Validators } from '@angular/forms';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './models/user';
import {EnsureAuthenticatedService} from './services/ensure-authenticated.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @ViewChild('frame') loginModal: ModalDirective;
  @ViewChild('feedbackframe') feedBackModal: ModalDirective;

  constructor(private router: Router, private auth: AuthService, private ensureAuth: EnsureAuthenticatedService,
              public snackBar: MatSnackBar) {}

  currentPage: string;
  loginFormModalEmail = new FormControl('', [Validators.email, Validators.required]);
  loginFormModalPassword = new FormControl('', [Validators.required]);
  loggedIn: boolean;
  email: string;
  loginMessage = '';
  showLoginmodal: boolean;
  commentFormControl = new FormControl('', [Validators.required]);
  commentEmailControl = new FormControl('', [Validators.required]);

  changePage(page) {
    this.currentPage = page;
  }

  ngOnInit() {
    this.ensureAuth.canActivate();
    this.ensureAuth.showLoginModal.subscribe(value => {
        if (value) {
          this.loginModal.show();
        }
    });
    this.auth.message.subscribe(msg => {
      this.loginMessage = msg;
    });
    this.currentPage = 'home';
    this.loggedIn = !!localStorage.getItem('token');
    this.auth.loggedIn.subscribe(value => {
      this.loggedIn = value;
      this.email = localStorage.getItem('token');
    });
    this.auth.currentPage.subscribe(value => {
      this.currentPage = value;
    });
  }

  showModal() {
    this.loginModal.show();
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
        this.loginModal.hide();
        this.snackBar.open('Logged In Successfully!!!', '', {
          duration: 2000, verticalPosition: 'bottom'
        });
      }
    }).catch(() => {
      this.snackBar.open('Login Failed!!!', '', {
        duration: 2000, verticalPosition: 'bottom'
      });
    });
  }

  logoutUser() {
    localStorage.clear();
    this.changePage('home');
    this.auth.loggedIn.next(false);
  }

  sendFeedback() {
    if (this.loggedIn) {
      this.auth.sendFeedBack(this.commentFormControl.value, this.commentEmailControl.value).then(msg => {
        this.feedBackModal.hide();
        this.snackBar.open(msg['text'], '', {
          duration: 2000, verticalPosition: 'bottom'
        });
      });
    } else {
      this.snackBar.open('Please Sign in to send feedback', '', {
        duration: 2000, verticalPosition: 'bottom'
      });
    }
  }
}
