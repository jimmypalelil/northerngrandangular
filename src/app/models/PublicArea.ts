import {ListItem} from './ListItem';


export class PublicArea extends ListItem {
  constructor(itemObj) {
    super();
    const {area, comments, status} = itemObj;
    this.itemName = area;
    this.extraInfo = comments;
    this.status = status !== undefined;
  }

  getExtraInfo() {
    return  this.extraInfo;
  }

  getItemName() {
    return this.itemName;
  }
}
