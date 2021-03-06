import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './models/user';
import {EnsureAuthenticatedService} from './services/ensure-authenticated.service';
import {ModalDirective} from 'angular-bootstrap-md';
import {MatSnackBar} from '@angular/material';
import {environment} from '../environments/environment';
import {Observable, Subscription} from 'rxjs';
import {isHK} from './lib/Utils';

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
  commentFormControl = new FormControl('', [Validators.required]);
  commentEmail: string;
  showSpinner = false;
  menuBtn: HTMLElement;
  homePage: HTMLElement;
  showChatBtn = true;
  showChatWindow = false;
  showChatBubble = false;
  imageUrl = environment.imageUrl;

  changePage(page) {this.currentPage = page; }


  ngOnInit() {
    let scriptUrl;
    if (environment.production) {
      scriptUrl = '/static/assets/js/';
    } else {
      scriptUrl = '/assets/js/';
    }
    const bodyEl = document.getElementsByTagName('body')[0];
    setTimeout(() => {
      const dynamicScripts = scriptUrl + 'classie.js';
      const node = document.createElement('script');
      node['src'] = dynamicScripts;
      node['type'] = 'text/javascript';
      bodyEl.appendChild(node);
    }, 1000);

    setTimeout(() => {
      const dynamicScripts = scriptUrl + 'main.js';
        const node = document.createElement('script');
        node['src'] = dynamicScripts;
        node['type'] = 'text/javascript';
        bodyEl.appendChild(node);
    }, 2000);

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
      if (!this.loggedIn) {
        this.snackBar.open('You Have Been Logged Out!!!', '', {
          duration: 2000, verticalPosition: 'bottom'
        });
      }
    });
    this.auth.currentPage.subscribe(value => {
      this.currentPage = value;
    });

    const temp = localStorage.getItem('showBubble')
    if (temp === null) {
      localStorage.setItem('showBubble', 'true');
      this.showChatBubble = true;
    } else if (temp === 'true') {
      this.showChatBubble = true;
    }
  }

  ngAfterViewInit() {
    this.menuBtn = document.querySelector('button.menu-button') as HTMLElement;
    this.homePage = document.getElementById('page-home') as HTMLElement;

    // Adding dynamic menu for Mobile View
    const pages = document.getElementsByClassName('page');

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i] as HTMLElement;
      page.onscroll = () => {
        const menu = document.getElementsByClassName('bottom-menu')[0] as HTMLElement;
        const menuBtn = document.getElementsByClassName('bottom-menu-button')[0] as HTMLElement;
        const topBtn = document.getElementById('myBtn') as HTMLElement;

        topBtn.onclick = () => {
          page.scrollTop = 0;
        };

        if (page.scrollTop > 20) {
          document.getElementById('myBtn').style.display = 'block';
          if (menu !== undefined && menuBtn !== undefined) {
            if (!menu.classList.contains('bottom-menu-clicked')) {
              menu.style.background = '#e78212';
              menuBtn.style.background = 'black';
            } else {
              document.getElementById('myBtn').style.display = 'none';
              menu.style.background = 'black';
              menuBtn.style.background = 'black';
              page.scrollTop = 0;
            }
          }
        }  else {
          document.getElementById('myBtn').style.display = 'none';
          if (menu !== undefined && menuBtn !== undefined) {
            if (!menu.classList.contains('bottom-menu-clicked')) {
              menu.style.background = 'transparent';
              menuBtn.style.background = 'transparent';
            }
          }
        }
      };
    } // End for dynamic menu for Mobile View
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
    document.getElementById('inspection-overlay').classList.toggle('inspection-overlay');
  }

  changeToHomePage() {
    this.currentPage = 'home';
  }

  toggleChat() {
    if (localStorage.getItem('showBubble') === 'true') {
      localStorage.setItem('showBubble', 'false');
      this.showChatBubble = false;
    }
    this.showChatWindow = !this.showChatWindow;
    this.showChatBtn = !this.showChatBtn;
  }

  isHk() {
    return isHK();
  }
}
