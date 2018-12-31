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

  getRoomList(type, month, year): Observable<Room[]> {
    return this.http.get<Room[]>(this.Url + type + '/' + year + '/' + month);
  }

  getLostList(): Observable<LostItem[]> {
    return this.http.get<LostItem[]>(this.Url + 'lost/lostItems');
  }

  getReturnedItemList(): Observable<ReturnedItem[]> {
    return this.http.get<ReturnedItem[]>(this.Url + 'lost/returnedItems');
  }

  changeRoomStatus(room: Room): Promise<any> {
    return this.http.post(this.Url + 'roomStatusChange', room).toPromise();
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

  returnItem(returnItem: ReturnedItem | (() => void)) {
    return this.http.post(this.lostUrl + 'returnItem', returnItem).toPromise();
  }

  undoReturn(returnItem: ReturnedItem) {
    return this.http.post(this.lostUrl + 'undoReturn', returnItem).toPromise();
  }

  updateLostItem(item): Promise<any> {
    return this.http.post(this.lostUrl + 'updateItem', item).toPromise();
  }
}

