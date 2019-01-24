import {Injectable, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

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
}
