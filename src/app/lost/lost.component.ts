import {AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
import {UpdatereturnedComponent} from '../updatereturned/updatereturned.component';
import {EnsureAuthenticatedService} from '../services/ensure-authenticated.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {jsonpFactory} from '@angular/http/src/http_module';
import {Socket} from 'ngx-socket-io';

@Component({
  selector: 'app-lost',
  templateUrl: './lost.component.html',
  styleUrls: ['./lost.component.scss']
})
export class LostComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource();
  tabList = ['Lost & Found Items', 'Returned Items'];
  displayedColumns = [];
  currentLostItem: LostItem;
  currentReturnItem: ReturnedItem;
  panelOpened: boolean;
  imageUrl = environment.imageUrl;
  showSpinner = false;
  updatedList: Observable<any>;

  constructor(private list: ListService, private snackBar: MatSnackBar, private updateSheet: MatBottomSheet,
              private ensureAuth: EnsureAuthenticatedService, private socket: Socket) {
    this.currentLostItem = new LostItem();
    this.currentReturnItem = new ReturnedItem();

  }

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort: MatSort;

  @Output() spinnerEvent = new EventEmitter<boolean>();

  ngOnInit() {
    this.socket.connect();
    this.socket.on('updatedList', data => {
      this.updateList(data);
    });
    this.socket.on('newItemAdded', data => {
      this.addItemToList(data);
    });
    this.socket.on('deletedLostItem', data => {
      this.deleteItemFromList(data);
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  deleteItemFromList(data) {
    let indexToDel;
    this.dataSource.data.forEach((row, index) => {
      if (row['_id'] === data[0]) {
        indexToDel = index;
      }
    });
    if (indexToDel) {
      this.dataSource.data.splice(indexToDel, 1);
      this.snackBarMsg('An Item was deleted by ' + data[1]);
      this.dataSource._updateChangeSubscription();
    }
  }

  addItemToList(data) {
    const itemData = JSON.parse(data[0]);
    this.dataSource.data.push(itemData);
    this.dataSource._updateChangeSubscription();
    this.snackBar.open('New Item was added by ' + data[1], '', {duration: 5000});
  }

  updateList(data) {
    this.dataSource.data.forEach(row => {
      if (row['_id'] === data['_id']) {
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            row[key] = data[key];
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getItemList();
    }, 500);
  }

  isHK(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'tester@test.com' || email === 'jimmypalelil@gmail.com';
  }

  getItemList() {
    this.toggleSpinner();
    this.displayedColumns = ['room_number', 'item_description', 'date', 'action'];

    this.list.getLostList().then(data => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      }
      this.toggleSpinner();
    });
  }

  toggleSpinner() {
    this.showSpinner = !this.showSpinner;
    this.spinnerEvent.emit(this.showSpinner);
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
      if (this.tabGroup.selectedIndex === 0) {
        this.list.deleteLostItem(this.currentLostItem, this.ensureAuth.getUserEmail());
      } else {
        this.list.deleteReturnedItem(this.currentReturnItem).then(msg => {
          this.dataSource.data.splice(this.dataSource.data.indexOf(this.currentReturnItem), 1);
          this.dataSource._updateChangeSubscription();
          this.snackBarMsg(msg['text']);
        });
      }
    } else {
      this.snackBarMsg('Only Housekeeping Dept can Delete Items');
    }
  }

  addItem() {
    if (this.ensureAuth.isUser()) {
      if (isNaN(this.currentLostItem.room_number) ||
        this.currentLostItem.item_description === '' || this.currentLostItem.date === undefined) {
        this.snackBarMsg('Looks like you forgot to add Some Details');
      } else {
        this.panelOpened = false;
        this.list.addNewLostItem(this.currentLostItem, this.ensureAuth.getUserEmail()).then(msg => {
          this.tabGroup.selectedIndexChange.emit(0);
          this.snackBarMsg('Item Added Successfully');
        });
      }
    } else {
      this.snackBarMsg('Only Housekeeping Dept can Add New Items');
    }
  }

  setPanelOpen(b: boolean) {
    this.panelOpened = b;
  }

  sendEmail() {
    this.list.sendItemEmail(this.currentLostItem).then(msg => {
      this.snackBarMsg(msg['text']);
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
      this.snackBarMsg('Oops! Looks like its missing some information');
    });
  }

  undoReturn() {
    this.list.undoReturn(this.currentReturnItem).then(msg => {
      this.tabGroup.selectedIndex = 0;
      this.snackBarMsg(msg['text']);
    });
  }

  openUpdateReturnedSheet(item) {
    this.updateSheet.open(UpdatereturnedComponent, {
      data: {item: item},
    });
  }

  snackBarMsg(msg) {
    this.snackBar.open(msg, '', {duration: 2000});
  }
}

