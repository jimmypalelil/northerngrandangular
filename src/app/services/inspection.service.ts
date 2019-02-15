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

  getEmployees(): Promise<any> {
    return this.http.get<any>(this.url + 'empList').toPromise();
  }

  startNewInspection(inspection: Inspection, empIDs: string[]): Promise<any> {
    return this.http.post(this.url + 'newInspection', [inspection, empIDs]).toPromise();
  }

  sendInspection(ins: any, inspectionScores: any, emps): Promise<any> {
    return this.http.post(this.url + 'inspectionResult', [ins, inspectionScores, emps]).toPromise();

  }

  getEmployeeIns(employeeID: string): Promise<any> {
    return this.http.get(this.url + 'getEmployeeMonthlyInspections/' + employeeID).toPromise();
  }

  resetInspections(): Promise<any> {
    return this.http.get(this.url + 'resetInspections').toPromise();
  }

  getInspections(emp_id: any, month: any, year: number): Promise<any> {
    return this.http.post(this.url + 'getEmployeeInspections', {emp_id, month, year}).toPromise();
  }

  getInspection(ins_id: string, emp_id: string): Promise<any> {
    return this.http.get(this.url + 'getEmployeeInspection/' +  ins_id + '/' + emp_id).toPromise();
  }

  deleteInspection(inspection, emp_id): Promise<any> {
    return this.http.post(this.url + 'deleteInspection', {inspection, emp_id}).toPromise();
  }

  deleteMonthlyInspections(currentEmployeeScore: any, empID: string): Promise<any> {
    return this.http.post(this.url + 'deleteMonthlyInspections/' + empID, currentEmployeeScore).toPromise();
  }

  createInsItems(): Promise<any> {
    return this.http.get(this.url + 'createInsItems').toPromise();
  }
}
