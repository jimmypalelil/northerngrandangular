import {AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {
  MatBottomSheet,
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
import {Observable} from 'rxjs';
import {Socket} from 'ngx-socket-io';
import {deleteElementFromJsonArray} from '../lib/Utils';

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
  userEmail = this.ensureAuth.getUserEmail();

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
    this.socket.on('returnedItem', data => {
      this.placeItemInRetunredList(data);
    });
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  placeItemInRetunredList(data) {
    const id = data[0];
    if (deleteElementFromJsonArray(id, this.dataSource.data)) {
      if (data[1] === this.userEmail) {
        this.snackBarMsg('Item was Was Placed in Returned items successfully!!!');
      } else {
        this.snackBarMsg('An Item was Placed in Returned items by ' + data[1], 5000);
      }
      this.dataSource._updateChangeSubscription();
    }
  }

  deleteItemFromList(data) {
    const id = data[0];
    if (deleteElementFromJsonArray(id, this.dataSource.data)) {
      if (data[1] === this.userEmail) {
        this.snackBarMsg('Item was deleted successfully!!!');
      } else {
        this.snackBarMsg('An Item was deleted by ' + data[1], 5000);
      }
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
    const itemData = data[0];
    this.dataSource.data.forEach(row => {
      if (row['_id'] === itemData['_id']) {
        for (const key in row) {
          if (row.hasOwnProperty(key)) {
            row[key] = itemData[key];
          }
        }
      }
    });
    if (data[1] === this.userEmail) {
      this.snackBarMsg('Item was updated successfully!!!');
    } else {
      this.snackBarMsg('An Item was updated by ' + data[1], 5000);
    }
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
    this.displayedColumns = ['room_number', 'guest_name', 'item_description', 'returned by', 'returned_date',
                                    'date_found', 'comments', 'action'];
    this.list.getReturnedItemList().then(data => {
      if (data.length > 0) {
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
      data: {
        item: item,
        userEmail: this.userEmail,
      },
    });
  }

  deleteLostItem() {
    if (this.isHK()) {
      if (this.tabGroup.selectedIndex === 0) {
        this.list.deleteLostItem(this.currentLostItem, this.userEmail);
      } else {
        this.list.deleteReturnedItem(this.currentReturnItem).then(msg => {
          this.dataSource.data.splice(this.dataSource.data.indexOf(this.currentReturnItem), 1);
          this.dataSource._updateChangeSubscription();
          this.snackBarMsg(msg['text'], 5000);
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
        this.list.addNewLostItem(this.currentLostItem, this.userEmail).then(msg => {
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
      this.snackBarMsg(msg['text'], 5000);
    });
  }

  returnToGuest() {
    this.currentReturnItem._id = this.currentLostItem._id;
    if (this.currentReturnItem.comments === undefined) {
      this.currentReturnItem.comments = '';
    }
    this.list.returnItem(this.currentReturnItem, this.userEmail).then(msg => {
      this.tabGroup.selectedIndex = 1; // switch to retrun items view
      this.snackBar.open(msg['text'], '', {duration: 2000});
    }).catch(err => {
      this.snackBarMsg('Oops! Looks like its missing some information');
    });
  }

  undoReturn() {
    this.list.undoReturn(this.currentReturnItem).then(msg => {
      this.tabGroup.selectedIndex = 0;
      this.snackBarMsg(msg['text'], 5000);
    });
  }

  openUpdateReturnedSheet(item) {
    this.updateSheet.open(UpdatereturnedComponent, {
      data: {item: item},
    });
  }

  snackBarMsg(msg, duration?: number) {
    this.snackBar.open(msg, '', {duration: duration ? duration : 2000});
  }
}

