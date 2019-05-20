import {AfterContentChecked, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getFrontDeskEmail, getHKEmail, isHK} from '../lib/Utils';
import {ChatService} from '../chat.service';
import {Socket} from 'ngx-socket-io';
import {Chat} from '../models/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterContentChecked {
  @Input() email: string;
  msg: string;
  msgs: Array<Chat>;

  @Output() closeChat: EventEmitter<boolean>;

  constructor(private chatService: ChatService, private socket: Socket) {
    this.msgs = [];
    this.closeChat = new EventEmitter();
  }

  ngOnInit() {
    this.getInitialMsgs();
    this.socket.on('newMsg', data => {
      this.msgs.push(data);
    });
  }

  ngAfterContentChecked() {
    const el = document.getElementsByClassName('chat-msgs')[0];
    el.scrollTo(0, el.scrollHeight);
  }

  getInitialMsgs() {
    this.chatService.getInitialMsgs().then(data => {
      this.msgs = data;
    });
  }

  handleSendMsg() {
    if (this.msg !== '') {
      const chat = {
        from_email: this.email,
        to_email: isHK() ? getFrontDeskEmail() : getHKEmail(),
        msg: this.msg,
        date: new Date()
      };
      this.chatService.sendMsg(chat);
    }
    this.msg = '';
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSendMsg();
    }
  }
}
