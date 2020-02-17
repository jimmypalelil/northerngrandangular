import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddTaskComponent} from '../dialogs/add-list-type/add-task.component';
import {HkListService} from '../../services/hk-list.service';
import {AddPublicAreaComponent} from '../dialogs/add-public-area/add-public-area.component';

@Component({
  selector: 'app-hk-list',
  templateUrl: './hk-list.component.html',
  styleUrls: ['./hk-list.component.scss']
})
export class HkListComponent implements OnInit {
  dateControl = new FormControl(moment());
  displayDate;
  serverDate;
  currentTask;
  taskList = [];
  guestRooms = [];
  publicAreas = [];
  floorNames = [];
  publicAreaNames = [];
  currentFloor: string;
  currentRoomList: [];
  currentPublicArea: string;
  currentPublicAreaList: [];
  completedList = {};
  currentDisplayType = 'guestRooms';
  constructor(private dialog: MatDialog, private hkListService: HkListService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getTaskList();
  }

  getTaskList() {
    this.hkListService.get('tasks', {}).then(data => {
      this.taskList = data;
      if (!this.currentTask) {
        this.currentTask = data[0];
        this.handleTaskSelect(this.currentTask);
      }
    });
  }

  getFrequencyDates() {
    if (this.currentTask) {
      let start;
      let end;
      let amtToSubtract;
      const dateString = this.dateControl.value;
      switch (this.currentTask.frequency) {
        case 'monthly':
          start = moment(dateString).startOf('month');
          end = moment(dateString).endOf('month');
          break;
        case 'weekly':
          start = moment(dateString).startOf('week');
          end = moment(dateString).endOf('week');
          break;
        case 'bi-weekly':
          amtToSubtract = (moment(dateString).week() + 1) % 2;
          start = moment(dateString).subtract(amtToSubtract, 'weeks').startOf('week');
          end = moment(start).add(1, 'weeks').endOf('week');
          break;
        case 'quarterly':
          amtToSubtract = (moment(dateString).month() + 3) % 3;
          start = moment(dateString).subtract(amtToSubtract, 'months').startOf('month');
          end = moment(start).add(2, 'months').endOf('month');
          break;
        case 'bi-yearly':
          amtToSubtract = (moment(dateString).month() + 6) % 6;
          start = moment(dateString).startOf('month').subtract(amtToSubtract, 'months').startOf('month');
          end = moment(start).startOf('month').add(5, 'months').endOf('month');
          break;
        case 'yearly':
          start = moment(dateString).startOf('year');
          end = moment(start).endOf('year');
          break;
      }
      return {start, end};
    }
  }

  getDisplayDate(start, end) {
    if (start && end) {
      return start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY');
    }
  }

  getServerFormattedDate(startDate) {
    return moment(startDate).format('YYYY-MM-DD');
  }

  getHkList() {
    this.hkListService.getHkList({hkAreas: this.currentTask.hkAreas}).then(data => {
      const {guestRooms, publicAreas} = data;
      if (guestRooms.length > 0) {
        this.currentDisplayType = 'guestRooms';
        this.guestRooms = guestRooms;
        this.floorNames = this.filterArrayWithId(this.guestRooms, 'floorNames')[0].floorNames;
        if (this.floorNames && this.floorNames.length > 0) {
          this.currentFloor = this.floorNames[0];
          this.currentRoomList = this.filterArrayWithId(this.guestRooms, this.currentFloor)[0];
        }
      } else {
        this.guestRooms = [];
        this.floorNames = [];
        this.currentDisplayType = 'publicAreas';
      }

      if (publicAreas.length > 0) {
        this.publicAreas = publicAreas;
        this.publicAreaNames = publicAreas.map(item => item._id);
        console.log(this.publicAreaNames);
        this.currentPublicArea = this.publicAreaNames[0];
        this.currentPublicAreaList = this.filterArrayWithId(this.publicAreas, this.currentPublicArea)[0];
      } else {
        this.publicAreas = [];
        this.publicAreaNames = [];
      }

      this.publicAreas = publicAreas;
    });
  }

  filterArrayWithId(array: any[], filterName) {
    return array.filter(item => item._id === filterName);
  }

  handleDateChange(forceFetchList?) {
    const {start, end} = this.getFrequencyDates();
    const serverDate = this.getServerFormattedDate(start);
    if (serverDate !== this.serverDate || forceFetchList) {
      this.serverDate = this.getServerFormattedDate(start);
      this.displayDate = this.getDisplayDate(start, end);
      this.getHkList();
      this.getCompletedList();
    }
  }

  handleAddTask() {
    const dialogRef = this.dialog.open(AddTaskComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.taskList.push(data);
      }
    });
  }

  handleAddPublicArea() {
    const dialogRef = this.dialog.open(AddPublicAreaComponent);
  }

  handleTaskSelect(task) {
    this.currentTask = task;
    this.handleDateChange(true);
  }

  updateListItem(id, item, operation) {
    this.hkListService.updateListItem({
      task: this.currentTask.task,
      start: this.serverDate,
      _id: id,
      items: [item],
      operation,
    }).then(data => {
      if (operation === 'complete') {
        if (this.completedList[id]) {
          this.completedList[id].push(item);
        } else {
          this.completedList = {
            [id]: [item]
          };
        }
      } else {
        this.completedList[id] = this.completedList[id].filter(value => value !== item);
      }
      this.snackBar.open(data.msg, null, {duration: 2000});
    });
  }

  getCompletedList() {
    this.hkListService.getCompletedList({
      task: this.currentTask.task,
      start: this.serverDate,
    }).then(data => {
      if (data.length > 0) {
        this.completedList = data[0];
      } else {
        this.completedList = {};
      }
    });
  }

  handleFloorNameClick(floorName) {
    this.currentDisplayType = 'guestRooms';
    this.currentFloor = floorName;
    this.currentRoomList = this.filterArrayWithId(this.guestRooms, floorName)[0];
  }

  handleAreaNameClick(areaGroup) {
    this.currentDisplayType = 'publicAreas';
    this.currentPublicArea = areaGroup;
    this.currentPublicAreaList = this.filterArrayWithId(this.publicAreas, this.currentPublicArea)[0];
  }
}
