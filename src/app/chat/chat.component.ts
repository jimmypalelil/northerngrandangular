import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {deleteElementFromJsonArray, getFrontDeskEmail, getHKEmail, isHK, isloggedIn} from '../lib/Utils';
import {ChatService} from '../chat.service';
import {Socket} from 'ngx-socket-io';
import {EnsureAuthenticatedService} from '../services/ensure-authenticated.service';
import {MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private chatService: ChatService, private socket: Socket, private ensureAuth: EnsureAuthenticatedService,
              private snackBar: MatSnackBar) {
    this.msgs = [];
    this.closeChat = new EventEmitter();
  }
  @Input() email: string;
  msg = '';
  msgs: Array<any>;
  subscriptions: Subscription[] = [];
  showChatAlert = false;
  messageScrollCount = 0;
  chatAlertId: number;

  @Output() closeChat: EventEmitter<boolean>;

  @ViewChild('chatMsg') chatMsg: ElementRef;
  @ViewChild('chatMsgs') chatMsgs: ElementRef;


  ngOnInit() {}

  ngAfterViewInit() {
    this.getInitialMsgs();

    this.subscriptions.push(this.socket.fromEvent('newMsg').subscribe(data => {
      this.msgs.push(data);
      this.handleNewIncomingMsg();
    }));

    this.subscriptions.push(this.socket.fromEvent('deletedMsg').subscribe(data => {
      const id = data['_id'];
      const email = data['email'];
      this.deleteMessage(id);
      this.snackBar.open('A message was deleted by ' + email, '',
        {duration: 3000});
    }));

    // let shouldGetMsgs = true;
    //
    // this.chatMsgs.nativeElement.addEventListener('scroll', () => {
    //   if (this.chatMsgs.nativeElement.scrollTop > 400) {
    //     shouldGetMsgs = true;
    //   }
    //   if (this.chatMsgs.nativeElement.scrollTop <= 400 && shouldGetMsgs) {
    //     this.messageScrollCount++;
    //     shouldGetMsgs = false;
    //     this.chatService.getMoreMessages(this.messageScrollCount).then(data => {
    //       const newMsgs = Array.from(data);
    //       newMsgs.reverse();
    //       this.msgs = newMsgs;
    //       console.log(this.msgs);
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getInitialMsgs() {
    this.chatService.getInitialMsgs().then(data => {
      data = Array.from(data);
      data.reverse();
      this.msgs = data;
      this.scrollToEnd();
    });
  }

  handleSendMsg() {
    const msg = this.chatMsg.nativeElement.value.trim();
    if (msg !== '') {
      const chatData = {
        from_email: this.email,
        to_email: isHK() ? getFrontDeskEmail() : getHKEmail(),
        msg: msg,
        date: new Date()
      };
      this.socket.emit('newMsg', chatData, id => {
        chatData['_id'] = id;
        this.msgs.push(chatData);
        this.scrollToEnd();
      });
    }
    this.chatMsg.nativeElement.value = '';
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleSendMsg();
    }
  }

  handleLoginClick() {
    this.ensureAuth.showLoginModal.next(true);
    this.closeChat.emit(true);
  }

  isLoggedIn() {
    return isloggedIn();
  }

  handleDeleteMessage(id) {
    const data = {_id: id, email: this.email};
    this.chatService.deleteMessage(data);
  }

  deleteMessage(id) {
    deleteElementFromJsonArray(id, this.msgs);
  }

  scrollToEnd() {
    window.setTimeout(() => {
      const el = document.getElementsByClassName('chat-msgs')[0];
      if (el) {
        el.scrollTo(0, el.scrollHeight);
      }
    }, 300);
  }

  private handleNewIncomingMsg() {
    window.clearTimeout(this.chatAlertId);
    this.showChatAlert = true;
    this.chatAlertId = window.setTimeout(() => {
      this.showChatAlert = false;
    }, 5000);

    if (this.chatMsgs.nativeElement.scrollTop >= this.chatMsgs.nativeElement.scrollHeight - 500) {
      this.scrollToEnd();
    }
  }
}
