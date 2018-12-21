import {AfterViewInit, Component, OnInit} from '@angular/core';
import {InspectionService} from '../services/inspection.service';
import {Inspection} from '../models/inspection';
import {Employee} from '../models/employee';
import {InspectionScore} from '../models/inspectionScore';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {
  employees: string[];
  currentEmployee: JSON;
  selectedEmployees: any;
  currentInspection: Inspection;
  newInspectionDate: Date;
  months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  panelOpened: boolean;
  insItems: any[];
  insScores: any;
  insComments: any;
  employeeScores: any;
  employeeInspections: any;
  inspectionItems: any;
  showInspections = false;
  showInspection = false;

  constructor(private insService: InspectionService, public snackBar: MatSnackBar) {
    this.panelOpened = false;
    this.currentInspection = new Inspection();
  }

  ngOnInit() {
    this.getEmployees();
  }


  getEmployees() {
    this.insService.getEmployees().subscribe(data => {
      this.employees = data;
      this.currentEmployee = data[0];
      this.getEmployeeIns(this.currentEmployee);
    });
  }

  getEmployeeIns(employee) {
    this.showInspections = false;
    this.showInspection = false;
    this.currentEmployee = employee;
    this.insService.getEmployeeIns(employee['_id']).subscribe(data => {
      this.employeeScores = data[0]['Monthly Scores'];
    });
  }

  startNewInspection() {
    this.currentInspection.day = this.newInspectionDate.getDate();
    this.currentInspection.month = this.months[this.newInspectionDate.getMonth()];
    this.currentInspection.year = this.newInspectionDate.getFullYear();
    let ids = [];
    for (const i in this.selectedEmployees) {
      ids.push(this.selectedEmployees[i]['_id']);
    }
    this.insService.startNewInspection(this.currentInspection, ids).then(data => {
      this.currentInspection._id = data[0];
      this.insItems = JSON.parse(data[1]);
      this.setPanelOpen(false);
      this.insScores = new Map();
      this.insComments = new Map();
    });
  }

  submitInspection() {
    const inspectionScores = [];
    this.insService.sendInspection(this.currentInspection._id, this.insScores, this.insComments).then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.getEmployees();
      this.insItems = undefined;
    });
  }

  setPanelOpen(b: boolean) {
    this.panelOpened = !this.panelOpened;
  }

  isAdmin(): boolean {
    const email = localStorage.getItem('token');
    return email === 'jimmypalelil@gmail.com' || email === 'tester@test.com';
  }

  resetInspections() {
    this.insService.resetInspections().subscribe(msg => {
      location.reload();
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
    });
  }

  viewInspections() {
    this.showInspections = true;
    this.showInspection = false;
    this.insService.getInspections(this.currentEmployee['_id']).subscribe(data => {
      this.employeeInspections = data[0]['inspections'];
    });
  }

  viewInspection(inspection) {
    this.showInspection = true;
    this.showInspections = false;
    this.insService.getInspection(inspection).subscribe(data => {
      this.inspectionItems = data;
    });
  }

  setCurrentInspection(inspection: any) {
    this.currentInspection = inspection;
  }

  deleteInspection() {
    this.insService.deleteInspection(this.currentInspection._id, this.currentInspection.month).subscribe(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.getEmployees();
      this.viewInspections();
    });
  }
}
