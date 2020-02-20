import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddTaskComponent} from '../dialogs/add-list-type/add-task.component';
import {HkListService} from '../../services/hk-list.service';
import {AddPublicAreaComponent} from '../dialogs/add-public-area/add-public-area.component';
import {EditTaskComponent} from '../dialogs/edit-task/edit-task.component';
import {Task} from '../../models/Task';
import {ListItem} from '../../models/ListItem';

enum DisplayType {
  GUEST_ROOMS,
  PUBLIC_AREAS
}

@Component({
  selector: 'app-hk-list',
  templateUrl: './hk-list.component.html',
  styleUrls: ['./hk-list.component.scss']
})

export class HkListComponent implements OnInit {
  dateControl = new FormControl(moment());
  currentTask: Task;
  taskList: Task[] = [];
  listReady = false;
  currentId: string;
  currentList: ListItem[];
  completedList = {};
  currentDisplayType = DisplayType.GUEST_ROOMS;

  constructor(private dialog: MatDialog, private hkListService: HkListService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getTaskList();
  }

  getTaskList() {
    this.hkListService.get('tasks', {}).then(data => {
      this.taskList = data;
      if (!this.currentTask) {
        this.handleTaskSelect(data[0]);
      }
    });
  }

  getHkList() {
    this.hkListService.getHkList({hkAreas: this.currentTask.hkAreas})
      .then(data => {
        const {guestRooms, publicAreas} = data;
        this.currentTask.setGuestRoomLists(guestRooms);
        this.currentTask.setPublicAreaLists(publicAreas);
        this.getCompletedList();

        if (this.currentTask.guestRoomLists.ids.length > 0) {
          this.currentDisplayType = DisplayType.GUEST_ROOMS;
          this.currentId = this.currentTask.guestRoomLists.ids[0];
        } else {
          this.currentDisplayType = DisplayType.PUBLIC_AREAS;
          this.currentId = this.currentTask.publicAreaLists.ids[0];
        }
        this.currentList = this.currentTask.getListForId(this.currentId);
        this.listReady = true;
      });
  }

  handleDateChange(forceFetchList?) {
    const newServerDate = this.currentTask.getServerFormattedDate(this.dateControl.value);
    if (newServerDate !== this.currentTask.serverDate || forceFetchList) {
      this.currentTask.setDisplayDate(this.dateControl.value);
      this.getHkList();
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
    this.dialog.open(AddPublicAreaComponent);
  }

  handleEditTask() {
    const dialogRef = this.dialog.open(EditTaskComponent);
    dialogRef.afterClosed().subscribe(taskObj => {
      if (taskObj) {
        this.taskList = this.taskList.filter(task => {
          return task.task !== taskObj.task;
        });
        this.taskList.push(taskObj);
        this.handleTaskSelect(taskObj);
      }
    });
  }

  handleTaskSelect(task) {
    if (
      !this.currentTask ||
      (task.task !== this.currentTask.task ||
        task.frequency !== this.currentTask.frequency ||
        task.hkAreas.length !== this.currentTask.hkAreas.length
      )
    ) {
      this.listReady = false;
      this.currentTask = new Task(task);
      this.handleDateChange(true);
    }
  }

  updateListItem(item: ListItem) {
    const operation = item.status ? 'incomplete' : 'complete';
    item.status = !item.status;

    this.hkListService.updateListItem({
      task: this.currentTask.task,
      start: this.currentTask.serverDate,
      _id: this.currentId,
      items: [item.itemName],
      operation,
    })
      .then(data => {
        this.snackBar.open(data.msg, null, {duration: 2000});
      })
      .catch(() => { // catch server error and reverse local list changes
        item.status = !item.status;
      });
  }

  getCompletedList() {
    this.hkListService.getCompletedList({
      task: this.currentTask.task,
      start: this.currentTask.serverDate,
    }).then(data => {
      if (data.length > 0) {
        // this.completedList = data[0];
        this.currentTask.markComplete(data[0]);
      } else {
        this.completedList = {};
      }
    });
  }

  handleIdClick(id, displayType: DisplayType) {
    this.currentDisplayType = displayType;
    this.currentId = id;
    this.currentList = this.currentTask.getListForId(id);
  }

  floor(x) {
    return Math.floor(x);
  }

  ceil(x) {
    return Math.ceil(x);
  }

  handlePrint() {
    window.setTimeout(() => window.print(), 100);
  }

  getWeekDay() {
    return moment().weekday();
  }
}

