import {TaskLists} from './TaskLists';
import {ItemList} from '../ItemList';

export class PublicAreaLists extends TaskLists {
  constructor(lists: []) {
    super();
    this.name = 'Public Areas';
    this.createListMap(lists);
  }

  createListMap(lists: []): void {
    this.listMap = new Map<string, ItemList>();
    lists.forEach((list: {_id: string, areas: []}) => {
      this.ids.push(list._id);
      this.listMap.set(list._id, new ItemList(list));
    });
  }
}
