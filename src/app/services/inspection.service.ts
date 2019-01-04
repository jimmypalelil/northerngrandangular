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

  sendInspection(ins: any, insScores: any, insComments: any, emps): Promise<any> {
    return this.http.post(this.url + 'inspectionResult', [ins, insScores, insComments, emps]).toPromise();

  }

  getEmployeeIns(employeeID: Observable<any>) {
    return this.http.get(this.url + 'getEmployeeMonthlyInspections/' + employeeID);
  }

  resetInspections(): Observable<any> {
    return this.http.get(this.url + 'resetInspections');
  }

  getInspections(emp_id: any, month: any, year: number): Promise<any> {
    return this.http.post(this.url + 'getEmployeeInspections', {emp_id, month, year}).toPromise();
  }

  getInspection(ins_id: string, emp_id: string): Observable<any> {
    return this.http.get(this.url + 'getEmployeeInspection/' +  ins_id + '/' + emp_id);
  }

  deleteInspection(inspection, emp_id): Promise<any> {
    return this.http.post(this.url + 'deleteInspection', {inspection, emp_id}).toPromise();
  }

  deleteMonthlyInspections(currentEmployeeScore: any, empID: string): Promise<any> {
    return this.http.post(this.url + 'deleteMonthlyInspections/' + empID, currentEmployeeScore).toPromise();
  }

  createInsItems(): Observable<any> {
    return this.http.get(this.url + 'createInsItems');
  }
}
