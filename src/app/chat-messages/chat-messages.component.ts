import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  @Input() msg: String;
  @Input() email: String;

  @Output() deleteMessage = new EventEmitter<string>();

  ngOnInit() {}

  openDialog(id) {
    const dialogRef = this.dialog.open(ChatDeleteComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(id);
        this.handleDeleteMessage(id);
      }
    });
  }

  handleDeleteMessage(id) {
    this.deleteMessage.emit(id);
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
