import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './models/user';
import {EnsureAuthenticatedService} from './services/ensure-authenticated.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {MatSnackBar} from '@angular/material';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {

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
  commentEmail: string;
  pages = [['Home', 'home'], ['Housekeeping', 'hk'], ['Lost & Found', 'lost'], ['Inspection', 'inspection']];
  imageUrl = environment.imageUrl;
  showSpinner = false;
  menuBtn: HTMLElement;
  homePage: HTMLElement;

  changePage(page) {
    this.currentPage = page;
  }

  ngOnInit() {
    let url;
    if (environment.production) {
      url = '/static/assets/js/';
    } else {
      url = '/assets/js/';
    }
    setTimeout(() => {
      const dynamicScripts = url + 'classie.js';
      const node = document.createElement('script');
      node['src'] = dynamicScripts;
      node['type'] = 'text/javascript';
      document.getElementsByTagName('body')[0].appendChild(node);
    }, 1000);

    setTimeout(() => {
      const dynamicScripts = url + 'main.js';
        const node = document.createElement('script');
        node['src'] = dynamicScripts;
        node['type'] = 'text/javascript';
        document.getElementsByTagName('body')[0].appendChild(node);
    }, 1500);

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
      this.commentEmail = this.email;
    });
    this.auth.currentPage.subscribe(value => {
      this.currentPage = value;
    });
  }

  ngAfterViewInit() {
    this.menuBtn = document.querySelector('button.menu-button') as HTMLElement;
    this.homePage = document.getElementById('page-home') as HTMLElement;
  }

  showModal() {
    this.loginModal.show();
  }

  loginUser() {
    this.toggleSpinner();
    const user = new User(this.loginFormModalEmail.value, this.loginFormModalPassword.value);
    this.auth.login(user).then( data => {
      if (data['email']) {
        this.email = data['email'];
        localStorage.setItem('token', data['email']);
        this.auth.loggedIn.next(true);
        this.changePage('home');
        this.homePage.click();
        this.loginModal.hide();
        this.snackBar.open('Logged In Successfully!!!', '', {
          duration: 2000, verticalPosition: 'bottom'
        });
        // location.reload();
        this.menuBtn.click();
      }
    }).catch(() => {
      this.snackBar.open('Login Failed!!!', '', {
        duration: 2000, verticalPosition: 'bottom'
      });
    }).then(() => this.toggleSpinner());
  }

  logoutUser() {
    localStorage.clear();
    this.auth.loggedIn.next(false);
    this.menuBtn.click();
    this.homePage.click();
    this.snackBar.open('You Have Been Logged Out!!!', '', {
      duration: 2000, verticalPosition: 'bottom'
    });
  }

  sendFeedback() {
    if (this.loggedIn) {
      this.auth.sendFeedBack(this.commentFormControl.value, this.commentEmail).then(msg => {
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

  setCurrentPage(pageName: string) {
    this.currentPage = pageName;
  }

  toggleSpinner() {
    this.showSpinner = !this.showSpinner;
    if (this.showSpinner) {
      document.getElementById('body').classList.add('inspection-overlay');
    } else {
      document.getElementById('body').classList.remove('inspection-overlay');
    }
  }
}
