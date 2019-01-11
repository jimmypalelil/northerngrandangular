import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import {BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {
  private BASE_URL = environment.baseUrl + 'auth';
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

  sendFeedBack(comment: any, email: string): Promise<any> {
    return this.http.post(this.BASE_URL + '/feedback', {comment, email}).toPromise();
  }
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
