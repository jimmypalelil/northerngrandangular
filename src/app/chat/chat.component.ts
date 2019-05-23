import {AfterContentChecked, AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {deleteElementFromJsonArray, getFrontDeskEmail, getHKEmail, isHK, isloggedIn} from '../lib/Utils';
import {ChatService} from '../chat.service';
import {Socket} from 'ngx-socket-io';
import {Chat} from '../models/chat';
import {EnsureAuthenticatedService} from '../services/ensure-authenticated.service';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterContentChecked, AfterViewInit, OnDestroy {
  @Input() email: string;
  msg: string;
  msgs: Array<any>;
  subscriptions: Subscription[] = [];

  @Output() closeChat: EventEmitter<boolean>;


  constructor(private chatService: ChatService, private socket: Socket, private ensureAuth: EnsureAuthenticatedService,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.msgs = [];
    this.closeChat = new EventEmitter();
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getInitialMsgs();

    this.subscriptions.push(this.socket.fromEvent('newMsg').subscribe(data => {
      this.msgs.push(data);
    }));

    this.subscriptions.push(this.socket.fromEvent('deletedMsg').subscribe(data => {
      const id = data['_id'];
      const email = data['email'];
      this.deleteMessage(id);
      this.snackBar.open('A message was deleted by ' + email, '',
        {duration: 3000});
    }));
  }

  ngAfterContentChecked() {
    const el = document.getElementsByClassName('chat-msgs')[0];
    if (el) {
      el.scrollTo(0, el.scrollHeight);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  openDialog(id) {
    const dialogRef = this.dialog.open(ChatDeleteComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleDeleteMessage(id);
      }
    });
  }
}

@Component({
  selector: 'app-chat-delete-dialog',
  templateUrl: 'app-chat-delete.html',
})
export class ChatDeleteComponent {

  constructor(
    public dialogRef: MatDialogRef<ChatDeleteComponent>) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
