import {ItemList} from '../ItemList';

export abstract class TaskLists {
  name;
  ids: string[] = [];
  listMap: Map<string, ItemList> = new Map<string, ItemList>();

  getListForId(id: string): ItemList {
    return this.listMap.get(id);
  }

  markComplete(completedList: object) {
    Object.keys(completedList).forEach(id => {
      const itemList = this.listMap.get(id);
      if (itemList) {
        itemList.markComplete(completedList[id]);
      }
    });
  }

}
