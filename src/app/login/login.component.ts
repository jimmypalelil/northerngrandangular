import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {FormControl, Validators} from '@angular/forms';
import {User} from '../models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginFormModalEmail = new FormControl('', Validators.email);
  loginFormModalPassword = new FormControl('', Validators.required);
  loginMessage: string;

  constructor(private auth: AuthService, private router: Router) {
    this.loginMessage = '';
  }

  ngOnInit() {
    this.auth.message.subscribe(msg => {
      this.loginMessage = msg;
    });
  }

  loginUser() {
    const user = new User(this.loginFormModalEmail.value, this.loginFormModalPassword.value);
    this.auth.login(user).then(data => {
      if (data['email']) {
        localStorage.setItem('token', data['email']);
        this.auth.changeLoggedInStatus(true);
        this.auth.changeCurrentPage('home');
        this.router.navigateByUrl('/');
      }
    });
  }
}
