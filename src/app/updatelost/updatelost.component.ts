import {Component, Inject, Input, OnInit} from '@angular/core';
import {ListService} from '../services/list.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-updatelost',
  templateUrl: './updatelost.component.html',
  styleUrls: ['./updatelost.component.scss']
})

export class UpdatelostComponent implements OnInit {
  item: any;
  userEmail: string;

  constructor(private listService: ListService,
              public bottomSheetRef: MatBottomSheetRef<UpdatelostComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
              private snackbar: MatSnackBar) {
    this.item = data.item;
    this.userEmail = data.userEmail;
  }

  ngOnInit() {
  }

  isHk(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'jimmypalelil@gmail.com' || email === 'tester@test.com';
  }

  updateItem() {
    this.listService.updateLostItem(this.item, this.userEmail);
  }
}
