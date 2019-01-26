import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetRef,
  MatSnackBar,
  MatSort,
  MatTabChangeEvent,
  MatTabGroup,
  MatTableDataSource
} from '@angular/material';
import {ListService} from '../services/list.service';
import {LostItem} from '../models/lostitem';
import {ReturnedItem} from '../models/returneditem';
import {environment} from '../../environments/environment';
import {UpdatelostComponent} from '../updatelost/updatelost.component';

@Component({
  selector: 'app-lost',
  templateUrl: './lost.component.html',
  styleUrls: ['./lost.component.scss']
})
export class LostComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  tabList = ['Lost & Found Items', 'Returned Items'];
  displayedColumns = [];
  currentLostItem: LostItem;
  currentReturnItem: ReturnedItem;
  panelOpened: boolean;
  actionHeader: string;
  showUpdateBar = false;
  imageUrl = environment.imageUrl;

  constructor(private list: ListService, private snackBar: MatSnackBar, private updateSheet: MatBottomSheet) {}

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    setTimeout(() => {
      this.getItemList();
    }, 500);
    this.currentLostItem = new LostItem();
    this.currentReturnItem = new ReturnedItem();
  }

  isHK(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'tester@test.com' || email === 'jimmypalelil@gmail.com';
  }

  getItemList() {
    this.displayedColumns = [];
    this.list.getLostList().then(data => {
      if (data.length > 0) {
        this.currentLostItem = data[0];
        for (const key in data[0]) {
          if (key !== '_id' && key !== 'cat') {
            this.displayedColumns.push(key);
          }
        }
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      }
    });
  }

  getReturnedItemList() {
    this.displayedColumns = [];
    this.list.getReturnedItemList().then(data => {
      if (data.length > 0) {
        for (const key in data[0]) {
          if (key !== '_id' && key !== 'cat') {
            this.displayedColumns.push(key);
          }
        }
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      }
    });
  }

  changeTab(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.getItemList();
    } else {
      this.getReturnedItemList();
    }
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
    if (this.tabGroup.selectedIndex === 0) {
      this.currentLostItem = item;
    } else {
      this.currentReturnItem = item;
    }
  }

  openUpdateSheet(item): void {
    this.updateSheet.open(UpdatelostComponent, {
      data: {item: item},
    });
  }

  deleteLostItem() {
    if (this.isHK()) {
      this.list.deleteLostItem(this.currentLostItem).then(msg => {
        this.dataSource.data.splice(this.dataSource.data.indexOf(this.currentLostItem), 1);
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
      if (isNaN(this.currentLostItem.room_number) ||
          this.currentLostItem.item_description === '' || this.currentLostItem.date === undefined) {
        this.snackBar.open('Looks like you forgot to add Some Details', '', {
          duration: 3000,
        });
      } else {
          this.panelOpened = false;
          this.list.addNewLostItem(this.currentLostItem).then(msg => {
            this.tabGroup.selectedIndexChange.emit(0);
            this.getItemList();
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
    this.list.sendItemEmail(this.currentLostItem).then(msg => {
      this.snackBar.open(msg['text'], '', {
        duration: 2000
      });
    });
  }

  returnToGuest() {
    this.currentReturnItem._id = this.currentLostItem._id;
    if (this.currentReturnItem.comments === undefined) {
      this.currentReturnItem.comments = '';
    }
    this.list.returnItem(this.currentReturnItem).then(msg => {
      this.tabGroup.selectedIndex = 1; // switch to retrun items view
      this.snackBar.open(msg['text'], '', {duration: 2000});
    }).catch(err => {
      this.snackBar.open('Oops! Looks like its missing some information', '',
        {duration: 2000});
    });
  }

  undoReturn() {
    this.list.undoReturn(this.currentReturnItem).then(msg => {
      this.tabGroup.selectedIndex = 0;
      this.snackBar.open(msg['text'], '', {duration: 2000});
    });
  }
}

