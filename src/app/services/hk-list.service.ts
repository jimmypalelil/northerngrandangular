import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HkListService {
  baseUrl = environment.hkListUrl + 'hkList/';

  constructor(private http: HttpClient) { }

  add(addType, value): Promise<any> {
    return this.http.post(this.baseUrl + 'add/' + addType, value).toPromise();
  }

  get(type, body): Promise<any> {
    return this.http.post(this.baseUrl + 'get/' + type, body).toPromise();
  }

  getHkList(hkAreas): Promise<any> {
    return this.http.post(this.baseUrl + 'getList', hkAreas).toPromise();
  }

  updateListItem(body): Promise<any> {
    return this.http.post(this.baseUrl + 'updateListItem', body).toPromise();
  }

  getCompletedList(body): Promise<any> {
    return this.http.post(this.baseUrl + 'getCompletedList', body).toPromise();
  }
}
