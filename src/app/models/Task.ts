import {TaskLists} from './TaskLists/TaskLists';
import {GuestRoomLists} from './TaskLists/GuestRoomLists';
import {PublicAreaLists} from './TaskLists/PublicAreaLists';
import * as moment from 'moment';
import {Moment} from 'moment';
import {ListItem} from './ListItem';

export class Task {
  task: string;
  frequency: string;
  hkAreas: [];
  guestRoomLists: TaskLists;
  publicAreaLists: TaskLists;
  displayDate: string;
  serverDate: string;

  constructor(taskObj) {

    const {task, frequency, hkAreas} = taskObj;
    this.task = task;
    this.frequency = frequency;
    this.hkAreas = hkAreas;
  }

  setGuestRoomLists(lists) {
    this.guestRoomLists = new GuestRoomLists(lists);
  }
  setPublicAreaLists(lists) {
    this.publicAreaLists = new PublicAreaLists(lists);
  }

  getListForId(id): ListItem[] {
    if (this.guestRoomLists.getListForId(id)) {
      return Array.from(this.guestRoomLists.getListForId(id).itemMap.values());
    } else {
     return Array.from(this.publicAreaLists.getListForId(id).itemMap.values());
    }
  }

  markComplete(completedList: object) {
    this.guestRoomLists.markComplete(completedList);
    this.publicAreaLists.markComplete(completedList);
  }

  setDisplayDate(dateString) {
    let start: Moment;
    let end: Moment;
    let amtToSubtract;
    switch (this.frequency) {
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

    this.serverDate =  this.getServerFormattedDate(start);
    this.displayDate =  this.getDisplayFormattedDate(start, end);
  }

  getServerFormattedDate(start) {
    return moment(start).format('YYYY-MM-DD');
  }

  getDisplayFormattedDate(start, end) {
    return start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY');
  }
}
