import { Component, OnInit, ViewChild } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  email: string;
  showLogin = true;

  @ViewChild('frame') loginModal;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.loggedIn.subscribe(value => {
      this.showLogin = !value;
      if (value) {
        this.email = localStorage.getItem('token');
      }
    });
  }

  showLoginModal() {
    this.loginModal.show();
  }
}
