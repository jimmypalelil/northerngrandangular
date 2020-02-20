import {ListItem} from './ListItem';


export class GuestRoom extends ListItem {

  constructor(itemObj) {
    super();
    const {room, type, status} = itemObj;
    this.itemName = room;
    this.extraInfo = type;
    this.status = status !== undefined;
  }

  getExtraInfo() {
    return  this.extraInfo;
  }

  getItemName() {
    return this.itemName;
  }


}
