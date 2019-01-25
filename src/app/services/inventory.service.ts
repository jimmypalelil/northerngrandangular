import {Injectable, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {InventoryItem} from '../models/InventoryItem';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private url =  environment.invUrl;

  constructor(private http: HttpClient) { }

  getInventoryItems(): Promise<any> {
    return this.http.get(this.url + 'inventoryList').toPromise();
  }

  addItem(newInventoryItem): Promise<any> {
    return this.http.post(this.url + 'newItem', newInventoryItem).toPromise();
  }

  deleteInventoryItem(currentInventoryItem: InventoryItem): Promise<any> {
    return this.http.get(this.url + 'deleteItem/' + currentInventoryItem['_id']).toPromise();
  }

  updateInventoryItem(currentInventoryItem: InventoryItem): Promise<any> {
    return this.http.post(this.url + 'editItem', currentInventoryItem).toPromise();
  }
}
