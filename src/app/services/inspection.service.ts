import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inspection} from '../models/inspection';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  // private url =  '/inspection/';
  private url =  environment.insUrl;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.http.get<any>(this.url + 'empList');
  }

  startNewInspection(inspection: Inspection, empIDs: string[]): Promise<any> {
    return this.http.post(this.url + 'newInspection', [inspection, empIDs]).toPromise();
  }

  sendInspection(id: string, insScores: any, insComments: any): Promise<any> {
    return this.http.post(this.url + 'inspectionResult', [id, insScores, insComments]).toPromise();

  }

  getEmployeeIns(employeeID: Observable<any>) {
    return this.http.get(this.url + 'employeeInspections/' + employeeID);
  }

  resetInspections(): Observable<any> {
    return this.http.get(this.url + 'resetInspections');
  }

  getInspections(empID: any): Observable<any> {
    return this.http.get(this.url + 'getInspections/' + empID);
  }

  getInspection(inspection: any): Observable<any> {
    return this.http.post(this.url + 'getInspection', inspection);
  }

  deleteInspection(id: any, month: string, year: number): Observable<any> {
    return this.http.get(this.url + 'deleteInspection/' + id + '/' + month + '/' + year);
  }

  deleteMonthlyInspections(currentEmployeeScore: any, empID: string): Promise<any> {
    return this.http.post(this.url + 'deleteMonthlyInspections/' + empID, currentEmployeeScore).toPromise();
  }
}
