import {Component, Inject, OnInit} from '@angular/core';
import {ListService} from '../services/list.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-updatereturned',
  templateUrl: './updatereturned.component.html',
  styleUrls: ['./updatereturned.component.scss']
})
export class UpdatereturnedComponent implements OnInit {
  item: any;
  constructor(private listService: ListService,
              public bottomSheetRef: MatBottomSheetRef<UpdatereturnedComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private snackbar: MatSnackBar) {
    this.item = data.item;
  }

  ngOnInit() {}

  isHk(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'jimmypalelil@gmail.com' || email === 'tester@test.com';
  }

  updateReturnedItem() {
    this.listService.updateReturnedItem(this.item).then(msg => {
      this.snackbar.open(msg['text'], '', {duration: 2000});
    });
  }
}
