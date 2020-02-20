import {ListItem} from './ListItem';
import {GuestRoom} from './GuestRoom';
import {PublicArea} from './PublicArea';


export class ItemList {
  id: string;
  itemMap: Map<string, ListItem>;

  constructor(obj: {_id: string, rooms?: [], areas?: []}) {
    const {_id, rooms, areas} = obj;
    this.id = _id;
    if (rooms) {
      this.itemMap = this.createListMap(rooms);
    } else {
      this.itemMap = this.createListMap(areas);
    }
  }

  createListMap(list: []): Map<string, ListItem> {
    const res = new Map<string, ListItem>();
    list.forEach((item: {room?, area?}) => {
      if (item.room) {
        res.set(item.room, new GuestRoom(item));
      } else {
        res.set(item.area, new PublicArea(item));
      }
    });
    return res;
  }

  markComplete(completedList: []) {
    completedList.forEach(item => {
      const mapItem = this.itemMap.get(item);
      if (mapItem) {
        mapItem.status = true;
      }
    });
  }
}
