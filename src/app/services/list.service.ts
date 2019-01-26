import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Room} from '../models/room';
import {LostItem} from '../models/lostitem';
import {ReturnedItem} from '../models/returneditem';
import {environment} from '../../environments/environment';

@Injectable()
export class ListService {
  private lostUrl = environment.lostUrl;
  private Url = environment.Url;

  constructor(private http: HttpClient) { }

  getRoomList(type, month, year):Promise<Room[]> {
    return this.http.get<Room[]>(this.Url + type + '/' + year + '/' + month).toPromise();
  }

  getLostList(): Promise<LostItem[]> {
    return this.http.get<LostItem[]>(this.Url + 'lost/lostItems').toPromise();
  }

  getReturnedItemList(): Promise<ReturnedItem[]> {
    return this.http.get<ReturnedItem[]>(this.Url + 'lost/returnedItems').toPromise();
  }

  changeRoomStatus(rooms: Room[], status): Promise<any> {
    return this.http.post(this.Url + 'roomStatusChange', [rooms, status]).toPromise();
  }

  deleteLostItem(currentItem: LostItem): Promise<any> {
    return this.http.get(this.lostUrl + 'deleteLostItem/' + currentItem._id).toPromise();
  }

  addNewLostItem(lostItem: LostItem): Promise<any> {
    return this.http.post(this.lostUrl + 'new', lostItem).toPromise();
  }

  sendItemEmail(lostItem: LostItem): Promise<any> {
    return this.http.post(this.lostUrl + 'email', lostItem).toPromise();
  }

  returnItem(returnItem: ReturnedItem | (() => void)): Promise<any> {
    return this.http.post(this.lostUrl + 'returnItem', returnItem).toPromise();
  }

  undoReturn(returnItem: ReturnedItem): Promise<any> {
    return this.http.post(this.lostUrl + 'undoReturn', returnItem).toPromise();
  }

  updateLostItem(item): Promise<any> {
    return this.http.post(this.lostUrl + 'updateItem', item).toPromise();
  }

  updateReturnedItem(item: any): Promise<any> {
    return this.http.post(this.lostUrl + 'updateReturnedItem', item).toPromise();
  }
}

