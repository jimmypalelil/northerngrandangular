import {Component, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from '../services/inventory.service';
import {MatSnackBar, MatSort, MatTabChangeEvent, MatTableDataSource} from '@angular/material';
import {InventoryItem} from '../models/InventoryItem';
import {Room} from '../models/room';
import {environment} from '../../environments/environment';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[];
  inventoryTableData: MatTableDataSource<any>;
  types: string[];
  displayedColumns: string[];
  currentTypeIndex = 0;
  newInventoryItem: InventoryItem;
  panelOpened: boolean;
  showUpdateBar: boolean;
  currentInventoryItem: InventoryItem;

  constructor(private inventoryService: InventoryService, private snackBar: MatSnackBar) {
    this.newInventoryItem = new InventoryItem();
    this.panelOpened = false;
    this.showUpdateBar = false;
    this.currentInventoryItem = new InventoryItem();
  }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    setTimeout(() => {
      this.getInventoryItems();
    }, 500);
  }

  getInventoryItems() {
    this.inventoryService.getInventoryItems().then(data => {
      this.inventoryItems = data;
      const types = [];
      const itemLabels = [];
      data.forEach(function(obj) {
        types.push(obj._id);
      });
      const item = data[0].items[0];
      for (const label in item) {
        if (label !== 'cat' && label !== 'type' && label !== '_id') {
          itemLabels.push(label);
        }
      }
      this.types = types;
      this.displayedColumns = itemLabels;
      this.displayedColumns.push('action');
      this.inventoryTableData = new MatTableDataSource(this.inventoryItems[this.currentTypeIndex].items);
      this.inventoryTableData.filterPredicate = (inventoryItem: any, filter: string) =>
        inventoryItem['item_name'] === filter || inventoryItem['cost_per_item'] === filter;
      this.inventoryTableData.sort = this.sort;
    });
  }

  changeType(index: number) {
    this.currentTypeIndex = index;
    this.inventoryTableData.data = this.inventoryItems[index].items;
    this.inventoryTableData.sort = this.sort;
  }

  setPanelOpen(value) {
    this.panelOpened = value;
  }

  addItem() {
    this.inventoryService.addItem(this.newInventoryItem).then(msg => {
      this.snackBar.open(msg['text'], '', {
        duration: 2000,
      });
      this.panelOpened = false;
      this.getInventoryItems();
    });
  }

  applyFilter(filter: string): void {
    this.inventoryTableData.filter = filter;
  }

  sortData(event) {
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    this.inventoryTableData.sort = this.sort;
  }

  sendItemInfo(inventoryItem) {
    this.currentInventoryItem = inventoryItem;
  }

  deleteInventoryItem() {
    this.inventoryService.deleteInventoryItem(this.currentInventoryItem).then(msg => {
      this.snackBar.open(msg['text'], '', {
        duration: 2000,
      });
      this.inventoryTableData.data.splice(this.inventoryTableData.data.indexOf(this.currentInventoryItem), 1);
      this.inventoryTableData._updateChangeSubscription();
    });
  }

  updateInventoryItem() {
    // Update Total Count first
    const i = this.currentInventoryItem;
    i['total_count'] = i['laundry'] + i['lock_up'] + i['second'] + i['third'] + i['fourth'] + i['fifth'] + i['sixth'] + i['par_stock'];
    i['total_cost'] = i['cost_per_item'] * i['total_count'];
    this.inventoryService.updateInventoryItem(this.currentInventoryItem).then(msg => {
      this.snackBar.open(msg['text'], '', {
        duration: 2000,
      });
    });
  }
}
