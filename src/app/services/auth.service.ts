import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable()
export class AuthService {
  // private BASE_URL = 'https://token-trial.herokuapp.com/auth';
  private BASE_URL = 'https://northerngrandmaintenance.herokuapp.com/auth';
  // private BASE_URL = 'http://127.0.0.1:5000/auth';
  loggedIn: Subject<boolean>;
  currentPage: Subject<string>;
  message: Subject<string>;

  constructor(private http: HttpClient) {
    this.loggedIn = new BehaviorSubject(false);
    this.currentPage = new Subject();
    this.message = new BehaviorSubject<string>('');
  }

  login(user: User): Promise<any> {
    const url = `${this.BASE_URL}/login`;
    return this.http.post(url, user, httpOptions).toPromise();
  }

  changeLoggedInStatus(status) {
    this.loggedIn.next(status);
  }

  changeCurrentPage(page) {
    this.currentPage.next(page);
  }

  setMessage(msg: string) {
    this.message.next(msg);
  }
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
