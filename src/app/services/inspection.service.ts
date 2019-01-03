import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inspection} from '../models/inspection';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
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
    return this.http.get(this.url + 'getEmployeeMonthlyInspections/' + employeeID);
  }

  resetInspections(): Observable<any> {
    return this.http.get(this.url + 'resetInspections');
  }

  getInspections(empID: any): Observable<any> {
    return this.http.get(this.url + 'getEmployeeInspections/' + empID);
  }

  getInspection(ins_id: any): Observable<any> {
    return this.http.get(this.url + 'getEmployeeInspection/' +  ins_id);
  }

  deleteInspection(inspection, emp_id): Promise<any> {
    return this.http.post(this.url + 'deleteInspection', {inspection, emp_id}).toPromise();
  }

  deleteMonthlyInspections(currentEmployeeScore: any, empID: string): Promise<any> {
    return this.http.post(this.url + 'deleteMonthlyInspections/' + empID, currentEmployeeScore).toPromise();
  }
}
