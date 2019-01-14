import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Room} from '../models/room';
import {Router} from '@angular/router';
import {ListService} from '../services/list.service';
import {MatSnackBar, MatSort, MatTabChangeEvent, MatTabGroup, MatTableDataSource} from '@angular/material';
import {MatButtonToggleGroup} from '@angular/material/button-toggle';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-hk',
  templateUrl: './hk.component.html',
  styleUrls: ['./hk.component.scss']
})
export class HkComponent implements OnInit, AfterViewInit {
  months = [['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    ['jan to jun', 'jul to dec'],
    ['jan to mar', 'apr to jun', 'july to sep', 'oct to dec']];

  floors = [{label: '2nd Floor', data: 200}, {label: '3rd Floor', data: 300}, {label: '4th Floor', data: 400},
    {label: '5th Floor', data: 500}, {label: '6th Floor', data: 600}];

  types = [{label: 'Bedding', data: 'beddings', index: 0}, {label: 'Carpet Shampoo', data: 'carpets', index: 1},
              {label: 'Bed Flips', data: 'mattress', index: 2}, {label: 'Pillows', data: 'pillows', index: 2},
                        {label: 'Pillow Protectors', data: 'pillowss', index: 1}];

  years = [2018, 2019];

  displayedColumns = ['select', 'room_number', 'type', 'status', 'edit'];
  dataDisplayColumns = ['room_number', 'type', 'status', 'edit'];

  statuses = ['All Rooms', 'Undone Rooms', 'Done Rooms'];
  counts = [0, 0, 0];

  dataSource: MatTableDataSource<Room>;
  currentFloor = 200;
  currentMonth: string;
  currentYear: number;
  currentType: any;
  currentStatus: string;
  showSpinner = false;
  selection = new SelectionModel<Room>(true, []);
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort;
  @ViewChild('floorBtnGrp') floorBtnGrp: MatButtonToggleGroup;

  constructor(private router: Router, private listService: ListService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.currentType = JSON.parse(JSON.stringify(this.types))[0];
    const date = new Date();
    const month = date.getMonth();
    this.currentMonth = this.months[0][month];
    this.currentYear = date.getFullYear();

  }

  ngAfterViewInit() {
    this.tabGroup.selectedIndex = new Date().getMonth();
    setTimeout(() => {
      this.getMonthList(this.currentType, this.currentMonth, this.currentYear);
    }, 1000);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.dataSource.filteredData.forEach(room => {
        this.selection.deselect(room);
      }) :
      this.dataSource.filteredData.forEach(room => {
        this.selection.select(room);
      });
  }

  getMonthList(type, month, year) {
    this.toggleSpinner();
    this.listService.getRoomList(type.data, month, year).then(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.filterPredicate = (room: Room, filter: String) =>
        (room.room_number >= Number(filter) &&
        room.room_number < (Number(filter) + 100)) ||
        (room.status === filter && room.room_number >= Number(this.currentFloor) && room.room_number < Number(this.currentFloor) + 100);
      this.changeFloor(this.currentFloor);
      this.currentType = type;
      this.currentStatus = 'all';
      this.toggleSpinner();
    });
  }

  changeTab(event: MatTabChangeEvent) {
    setTimeout(() => {
      this.currentMonth = this.months[this.currentType['index']][event.index];
      this.getMonthList(this.currentType, this.currentMonth, this.currentYear);
    }, 1000);
  }

  changeFloor(floor) {
    this.currentFloor = floor;
    this.dataSource.filter = floor;
    let doneCount = 0;
    this.dataSource.filteredData.forEach(function (room) {
      if (room.status === 'clean') {
        doneCount++;
      }
    });
    const total = this.dataSource.filteredData.length;
    this.counts = [total, total - doneCount, doneCount];
  }

  setType(type) {
    if (this.currentType !== type) {
      this.currentType = type;
      this.currentMonth = this.months[type.index][0];
      this.getMonthList(type, this.currentMonth, this.currentYear);
      this.tabGroup.selectedIndex = 0;
    }
  }

  changeRoomStatus(room: Room) {
    if (room.status === 'clean') {
      room.status = 'not done';
      this.counts[2]--;
      this.counts[1]++;
    } else {
      room.status = 'clean';
      this.counts[1]--;
      this.counts[2]++;
    }
    this.listService.changeRoomStatus([room], room.status).then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000, verticalPosition: 'bottom'
      });
    });

  }

  sortData(event) {
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
  }

  setStatus(index) {
    this.selection.clear();
    if (index === 1) {
      this.dataSource.filter = 'not done';
    } else if (index === 2) {
      this.dataSource.filter = 'clean';
    } else {
      this.dataSource.filter = '' + this.currentFloor;
    }
  }

  setCurrentYear(year: number) {
    if (year !== this.currentYear) {
      this.currentYear = year;
      this.getMonthList(this.currentType, this.currentMonth, this.currentYear);
    }
  }

  toggleSpinner() {
    this.showSpinner = !this.showSpinner;
    if (this.showSpinner) {
      document.getElementById('body').classList.add('inspection-overlay');
    } else {
      document.getElementById('body').classList.remove('inspection-overlay');
    }
  }

  changeSelectRoomStatus(status) {
    this.toggleSpinner();
    const selectedRooms: Room[] = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      const room = this.selection.selected[i];
      if (room.status !== status) {
        selectedRooms.push(room);
        room.status = status;
        if (status === 'not done') {
          this.counts[2]--;
          this.counts[1]++;
        } else {
          this.counts[1]--;
          this.counts[2]++;
        }
      }
    }

    this.listService.changeRoomStatus(selectedRooms, status).then(msg => {
      this.toggleSpinner();
      this.selection.clear();
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
    });
  }
}
