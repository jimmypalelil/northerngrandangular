import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Room} from '../models/room';
import {Router} from '@angular/router';
import {ListService} from '../services/list.service';
import {MatSnackBar, MatSort, MatTabChangeEvent, MatTabGroup, MatTableDataSource} from '@angular/material';
import {MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-hk',
  templateUrl: './hk.component.html',
  styleUrls: ['./hk.component.scss']
})
export class HkComponent implements OnInit, OnDestroy, AfterViewInit {
  months = [['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    ['jan to jun', 'jul to dec'],
    ['jan to mar', 'apr to jun', 'july to sep', 'oct to dec']];

  floors = [{label: '2nd Floor', data: 2}, {label: '3rd Floor', data: 3}, {label: '4th Floor', data: 4}, {label: '5th Floor', data: 5},
    {label: '6th Floor', data: 6}];

  types = [{label: 'Bedding', data: 'beddings', index: 0}, {label: 'Carpet Shampoo', data: 'carpets', index: 1},
              {label: 'Bed Flips', data: 'mattress', index: 2}, {label: 'Pillows', data: 'pillows', index: 2},
                        {label: 'Pillow Protectors', data: 'pillowss', index: 1}];

  displayedColumns = ['room_number', 'type', 'status', 'edit'];

  statuses = ['All Rooms', 'Undone Rooms', 'Done Rooms'];
  counts = [0, 0, 0];

  dataSource: MatTableDataSource<Room>;
  currentFloor = '2';
  currentMonth: string;
  currentYear: number;
  currentType: Object;
  tableSorter: MatSort;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(MatSort) sort;
  @ViewChild('floorBtnGrp') floorBtnGrp: MatButtonToggleGroup;

  constructor(private router: Router, private listService: ListService, public snackBar: MatSnackBar) {
    this.tableSorter = new MatSort();
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
    }, 1000);
  }


  ngOnDestroy(): void {
    this.dataSource.disconnect();
  }


  goToLogin(): Promise<any> {
      return this.router.navigateByUrl('/login');
    }

  getMonthList(type, month, year) {
    this.listService.getRoomList(type.data, month, year).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      let undoneCount = 0, doneCount = 0;
      this.dataSource.data.forEach(function (room) {
        if (room.status === 'clean') {
          doneCount++;
        } else {
          undoneCount++;
        }
      });
      this.counts = [doneCount + undoneCount, undoneCount, doneCount];
      this.dataSource.filterPredicate = (room: Room, filter: String) =>
        (room.room_number >= Number(filter) &&
        room.room_number < (Number(filter) + 100)) ||
        room.status === filter;
      this.currentType = type;
      this.changeFloor(2);
    });
  }

  changeTab(event: MatTabChangeEvent) {
    setTimeout(() => {
      this.currentMonth = this.months[this.currentType['index']][event.index];
      this.getMonthList(this.currentType, this.currentMonth, this.currentYear);
    }, 1000);
  }

  changeFloor(floor) {
    floor *= 100;
    this.dataSource.filter = floor;
    this.currentFloor = floor;
  }

  setType(type) {
    this.currentType = type;
    this.getMonthList(type, this.months[type.index][0], 2018);
    this.tabGroup.selectedIndex = 0;
  }

  changeRoomStatus(room: Room) {
    this.listService.changeRoomStatus(room).then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
    });
    if (room.status === 'clean') {
      room.status = 'not done';
      this.counts[2]--;
      this.counts[1]++;
    } else {
      room.status = 'clean';
      this.counts[1]--;
      this.counts[2]++;
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
    if (index === 1) {
      this.dataSource.filter = 'not done';
    } else if (index === 2) {
      this.dataSource.filter = 'clean';
    } else {
      this.dataSource.filter = '';
    }
  }
}
