import {AfterViewInit, Component, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import {Room} from '../models/room';
import {Router} from '@angular/router';
import {ListService} from '../services/list.service';
import {MatSnackBar, MatSort, MatTabChangeEvent, MatTabGroup, MatTableDataSource} from '@angular/material';
import {MatButtonToggleGroup} from '@angular/material/button-toggle';
import {SelectionModel} from '@angular/cdk/collections';
import {stringify} from 'querystring';

@Component({
  selector: 'app-hk',
  templateUrl: './hk.component.html',
  styleUrls: ['./hk.component.scss']
})
export class HkComponent implements OnInit, AfterViewInit {
  months = [
    ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    ['jan to jun', 'jul to dec'],
    ['jan to mar', 'apr to jun', 'july to sep', 'oct to dec']
  ];

  floors = [{label: '2nd Floor', data: 200}, {label: '3rd Floor', data: 300}, {label: '4th Floor', data: 400},
    {label: '5th Floor', data: 500}, {label: '6th Floor', data: 600}];

  types = [{label: 'Bedding', data: 'beddings', index: 0}, {label: 'Carpet Shampoo', data: 'carpets', index: 1},
    {label: 'Bed Flips', data: 'mattress', index: 2}, {label: 'Pillows', data: 'pillows', index: 2},
    {label: 'Pillow Protectors', data: 'pillowss', index: 1}, {label: 'Drains', data: 'drains', index: 0},
    {label: 'Wall Washing', data: 'walls', index: 2}];

  years = [2018, 2019];

  displayedColumns = ['select', 'room_number', 'type', 'status', 'edit'];
  dataDisplayColumns = ['room_number', 'type', 'status', 'edit'];
  currentFloor = 200;
  statuses = [{label: 'All Rooms', data: this.currentFloor}, {label: 'Undone Rooms', data: 'not done'},
    {label: 'Done Rooms', data: 'clean'}];
  currentStatusIndex: number;
  counts = [0, 0, 0];
  allRooms = [[]];

  dataSource: MatTableDataSource<Room>;
  currentMonth: string;
  currentYear: number;
  currentType: any;
  showSpinner = false;
  selection = new SelectionModel<Room>(true, []);
  showMenu = false;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort;
  @ViewChild('floorBtnGrp') floorBtnGrp: MatButtonToggleGroup;

  @Output() spinnerEvent = new EventEmitter<boolean>();

  constructor(private router: Router, private listService: ListService, public snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<any>();
  }

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
    }, 500);
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
      this.dataSource = new MatTableDataSource();
      const print_data = [[], [], [], [], []];
      data.forEach(function(room) {
        print_data[Math.floor(room.room_number / 100) - 2].push(room);
      });
      this.allRooms = print_data;
      this.dataSource.filterPredicate = (room: Room, filter: any) =>
        room.status === filter || room.room_number >= Number(filter);
      this.changeFloor(this.currentFloor);
      this.currentType = type;
    }).catch(() => {
      this.snackBar.open('Connection Error....Will Try Again in 5 Seconds!!!', '', {
        duration: 2000, verticalPosition: 'bottom'
      });
      setTimeout(() => {
        this.getMonthList(type, month, year);
      }, 5000);
    }).then(() => this.toggleSpinner());
  }

  changeTab(event: MatTabChangeEvent) {
    this.currentMonth = this.months[this.currentType['index']][event.index];
    setTimeout(() => {
      this.getMonthList(this.currentType, this.currentMonth, this.currentYear);
    }, 500);
  }

  changeFloor(floor) {
    this.currentFloor = floor;
    this.dataSource.data = this.allRooms[floor / 100 - 2];
    let doneCount = 0;
    this.dataSource.data.forEach(function (room) {
      if (room.status === 'clean') {
        doneCount++;
      }
    });
    const total = this.dataSource.data.length;
    this.counts = [total, total - doneCount, doneCount];
    this.selection.clear();
    this.currentStatusIndex = 0;
    this.dataSource.filter = floor;
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
    if (this.isHK()) {
      const newStatus = room.status === 'clean' ? 'not done' : 'clean';
      if (newStatus === 'not done') {
        this.counts[2]--;
        this.counts[1]++;
      } else {
        this.counts[1]--;
        this.counts[2]++;
      }
      room.status = newStatus;

      this.listService.changeRoomStatus([room], newStatus).then(msg => {
        this.snackBar.open(msg['text'].toUpperCase(), '', {
          duration: 2000, verticalPosition: 'bottom'
        });
      }).catch(() => {
        this.snackBar.open('Connection Error....Try AGAIN!!!', '', {
          duration: 2000, verticalPosition: 'bottom'
        });
        if (newStatus === 'not done') {
          this.counts[2]++;
          this.counts[1]--;
          room.status = 'clean';
        } else {
          this.counts[1]++;
          this.counts[2]--;
          room.status = 'not done';
        }
      });
    } else {
      this.snackBar.open('Only Housekeeping Department can Change Status', '', {
        duration: 2000,
      });
    }
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
    if (this.counts[index] !== 0) {
      this.selection.clear();
      this.currentStatusIndex = index;
      this.dataSource.filter = stringify(this.statuses[index].data);
    } else {
      this.snackBar.open('No ' + this.statuses[index].label, '', {
        duration: 2000, verticalPosition: 'bottom'
      });
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
    this.spinnerEvent.emit(this.showSpinner);
  }

  isHK(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'tester@test.com' || email === 'jimmypalelil@gmail.com';
  }

  changeSelectRoomStatus(status) {
    if (this.isHK()) {
      this.toggleSpinner();
      const selectedRooms: Room[] = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        const room = this.selection.selected[i];
        if (room.status !== status) {
          selectedRooms.push(room);
        }
      }
      this.listService.changeRoomStatus(selectedRooms, status).then(msg => {
        this.selection.clear();
        this.snackBar.open(msg['text'].toUpperCase(), '', {
          duration: 2000,
        });
        let doneCount = 0;
        selectedRooms.forEach(function (room) {
          room.status = status;
          if (status === 'clean') {
            doneCount++;
          }
        });
        this.counts[2] = doneCount;
        this.counts[1] = this.counts[0] - doneCount;
      }).catch(() => {
        this.snackBar.open('Connection Error....Try AGAIN!!!', '', {
          duration: 2000,
        });
      }).then(() => this.toggleSpinner());
    } else {
      this.snackBar.open('Only Housekeeping Department can Change Status', '', {
        duration: 2000,
      });
    }
  }

  // for mobile view
  toggleMenu() {
    const menu = document.getElementsByClassName('menu')[0] as HTMLElement;
    const menuBtn = document.getElementsByClassName('bottom-menu-button')[0] as HTMLElement;
    const menuBar = document.getElementsByClassName('bottom-menu')[0] as HTMLElement;

    menu.classList.toggle('menu-show');
    menuBtn.classList.toggle('bottom-menu-button-clicked');
    menuBar.classList.toggle('bottom-menu-clicked');
  }
}
