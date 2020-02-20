import {TaskLists} from './TaskLists';
import {ItemList} from '../ItemList';


export class GuestRoomLists extends TaskLists {
  constructor(lists: []) {
    super();
    this.name = 'Guest Rooms';
    this.createListMap(lists);
  }

  createListMap(lists: []): void {
    this.listMap = new Map<string, ItemList>();
    lists.forEach((list: {_id: string, rooms: [], floorNames?: string[]}) => {
      if (list._id !== 'floorNames') {
        this.listMap.set(list._id, new ItemList(list));
      } else {
        this.ids = list.floorNames;
      }
    });
  }
}
