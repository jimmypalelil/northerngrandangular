import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private chatUrl = environment.chatUrl;

  constructor(private http: HttpClient, private socket: Socket) { }

  getInitialMsgs(): Promise<any> {
    return this.http.get(this.chatUrl + 'getInitialMsgs').toPromise();
  }

  getMoreMessages(count: number): Promise<any> {
    return this.http.get(this.chatUrl + 'getMoreMsgs/' + count).toPromise();
  }
}
