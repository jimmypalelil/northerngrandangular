import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSnackBar, MatSort, MatTabChangeEvent, MatTabGroup, MatTableDataSource} from '@angular/material';
import {ListService} from '../services/list.service';
import {LostItem} from '../models/lostitem';
import {isNullOrUndefined} from 'util';
import {stringify} from 'querystring';
import {ReturnedItem} from '../models/returneditem';

@Component({
  selector: 'app-lost',
  templateUrl: './lost.component.html',
  styleUrls: ['./lost.component.scss']
})
export class LostComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  tabList = ['Lost & Found Items', 'Returned Items'];
  displayedColumns = [];
  currentItem: LostItem;
  newDate: Date;
  newItemDesc: string;
  newRoom: number;
  newReturnedBy: number;
  newReturnDate: number;
  newComments: number;
  lostItem: LostItem;
  panelOpened: boolean;
  returnItem: ReturnedItem;

  constructor(private list: ListService, private snackBar: MatSnackBar) {
    this.lostItem = new LostItem();
  }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getItemList();
    this.currentItem = new LostItem();
    this.returnItem = new ReturnedItem();
  }

  isHK(): boolean {
      return localStorage.getItem('token') !== 'reservations@northerngrand.ca';
  }

  getItemList() {
    this.displayedColumns = [];
    this.list.getLostList().subscribe(data => {
      for (const key in data[0]) {
        if (key !== '_id' && key !== 'cat') {
          this.displayedColumns.push(key);
        }
      }
      this.displayedColumns.push('action');
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  getReturnedItemList() {
    this.displayedColumns = [];
    this.list.getReturnedItemList().subscribe(data => {
      for (const key in data[0]) {
        if (key !== '_id' && key !== 'cat') {
          this.displayedColumns.push(key);
        }
      }
      this.displayedColumns.push('action');
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  changeTab(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.getItemList();
    } else {
      this.getReturnedItemList();
    }
    this.sort.active = '';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData(event) {
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    this.dataSource.sort = this.sort;
  }

  sendItemInfo(item) {
    this.currentItem = item;
    this.returnItem.room_number = item.room_number;
    this.returnItem.item_description = item.item_description;
    this.returnItem.date_found = item.date;
  }

  deleteLostItem() {
    if (this.isHK()) {
      this.list.deleteLostItem(this.currentItem).then(msg => {
        this.dataSource.data.splice(this.dataSource.data.indexOf(this.currentItem), 1);
        this.dataSource._updateChangeSubscription();
        this.snackBar.open(msg['text'], '', {
          duration: 2000,
        });
      });
    } else {
      this.snackBar.open('Only Housekeeping Dept can Delete Items', '', {
        duration: 2000,
      });
    }
  }

  addItem() {
    if (this.isHK()) {
      this.lostItem.room_number = this.newRoom;
      this.lostItem.item_description = this.newItemDesc;
      this.lostItem.date = this.newDate;
      if (isNaN(this.newRoom) || this.newItemDesc === '' || this.newDate === undefined) {
        this.snackBar.open('Looks like you forgot to add Some Details', '', {
          duration: 3000,
        });
      } else {
          this.panelOpened = false;
          this.list.addNewLostItem(this.lostItem).then(msg => {
            this.tabGroup.selectedIndexChange.emit(0);
            const data = this.dataSource.data;
            data.push(JSON.parse(JSON.stringify(this.lostItem)));
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.sort = this.sort;
            this.snackBar.open('Item Added Successfully', '', {
              duration: 2000
            });
        });
      }
    } else {
      this.snackBar.open('Only Housekeeping Dept can Add New Items', '', {
        duration: 2000
      });
    }
  }

  setPanelOpen(b: boolean) {
    this.panelOpened = b;
  }

  sendEmail() {
    this.list.sendItemEmail(this.currentItem).then(msg => {
      this.snackBar.open(msg['text'], '', {
        duration: 2000
      });
    });
  }

  returnedItem() {
    this.returnItem._id = this.currentItem._id;
    if (this.returnItem.comments === '') {
      this.returnItem.comments = '';
    }
    this.list.returnItem(this.returnItem).then(msg => {
      this.snackBar.open(msg['text'], '', {duration: 2000});
    });
  }
}
