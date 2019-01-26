import {Component, Inject, OnInit} from '@angular/core';
import {ListService} from '../services/list.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-updatelost',
  templateUrl: './updatelost.component.html',
  styleUrls: ['./updatelost.component.scss']
})
export class UpdatelostComponent implements OnInit {
  item: any;

  constructor(private listService: ListService,
              private bottomSheetRef: MatBottomSheetRef<UpdatelostComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private snackbar: MatSnackBar) {
    this.item = data.item;
  }

  ngOnInit() {
  }

  isHk(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'jimmypalelil@gmail.com' || email === 'tester@test.com';
  }

  updateItem() {
    this.listService.updateLostItem(this.item).then(msg => {
      this.snackbar.open(msg['text'], '', {duration: 2000});
    });
  }
}
