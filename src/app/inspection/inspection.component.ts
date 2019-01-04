import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {InspectionService} from '../services/inspection.service';
import {Inspection} from '../models/inspection';
import {MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Room} from '../models/room';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit {
  employees: any[];
  currentEmployee: JSON;
  selectedEmployees: any;
  currentInspection: Inspection;
  newInspectionDate: Date;
  currentEmployeeScore: any;
  months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  panelOpened: boolean;
  insItems: any[];
  insScores: any;
  insComments: any;
  employeeScores: MatTableDataSource<any>;
  employeeInspections: MatTableDataSource<any>;
  inspectionItems: any;
  showInspections = false;
  showInspection = false;
  MonthInspectionsDisplayedColumns = ['month', 'year', 'num_inspections', 'score', 'view/delete'];
  inspectionsDisplayedColumns = ['room_number', 'day', 'month', 'year', 'score', 'view/delete'];
  scoreCategory = ['Bad', 'Needs Improvement', 'Excellent'];
  tableSorter: MatSort;

  @Input()
  showSpinner: boolean;

  constructor(private insService: InspectionService, public snackBar: MatSnackBar) {
    this.panelOpened = false;
    this.currentInspection = new Inspection();
    this.tableSorter = new MatSort();
    this.showSpinner = false;
  }

  @ViewChild(MatSort) sort;

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
      this.employeeScores = new MatTableDataSource(data[0]['Monthly Scores']);
      this.employeeScores.sort = this.sort;
    });
  }

  startNewInspection() {
    this.toggleSpinner();
    this.currentInspection.day = this.newInspectionDate.getDate();
    this.currentInspection.month = this.months[this.newInspectionDate.getMonth()];
    this.currentInspection.year = this.newInspectionDate.getFullYear();
    const ids = [];
    for (const i in this.selectedEmployees) {
      ids.push(this.selectedEmployees[i]['_id']);
    }
    this.insService.startNewInspection(this.currentInspection, ids).then(data => {
      this.currentInspection._id = data[0];
      this.insItems = JSON.parse(data[1]);
      this.toggleNewInspectionPanel();
      this.insScores = new Map();
      this.insComments = new Map();
      this.showInspection = true;
      this.showInspections = false;
      this.toggleSpinner();
    });
  }

  submitInspection() {
    this.toggleSpinner();
    this.insService.sendInspection(this.currentInspection, this.insScores, this.insComments, this.selectedEmployees).then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.getEmployees();
      this.insItems = undefined;
      this.toggleSpinner();
    });
  }

  toggleNewInspectionPanel() {
    this.panelOpened = !this.panelOpened;
  }

  isAdmin(): boolean {
    const email = localStorage.getItem('token');
    return email === 'jimmypalelil@gmail.com' || email === 'tester@test.com';
  }

  resetInspections() {
    this.toggleSpinner();
    this.insService.resetInspections().subscribe(msg => {
      location.reload();
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.toggleSpinner();
    });
  }

  viewInspections(monthInspection) {
    this.currentEmployeeScore = monthInspection;
    this.insService.getInspections(this.currentEmployee['_id'], monthInspection['month'], monthInspection['year']).then(data => {
      this.showInspections = true;
      this.showInspection = false;
      this.employeeInspections = new MatTableDataSource<any>(data);
      this.employeeInspections.sort = this.sort;
    });
  }

  viewInspection(inspection) {
    this.currentInspection = inspection;
    this.insService.getInspection(inspection['_id'], this.currentEmployee['_id']).subscribe(data => {
      this.showInspection = true;
      this.showInspections = false;
      this.inspectionItems = data;
    });
  }

  setCurrentInspection(inspection: any) {
    this.currentInspection = inspection;
  }

  deleteInspection() {
    this.toggleSpinner();
    this.insService.deleteInspection(this.currentInspection, this.currentEmployee['_id']).then(msg => {
      this.snackBar.open(msg['text'], '', {
        duration: 2000,
      });
      this.getEmployees();
      this.viewInspections(this.currentEmployeeScore);
      this.toggleSpinner();
    });
  }

  setCurrentScore(employeeScore: any) {
    this.currentEmployeeScore = employeeScore;
  }

  deleteMonthlyInspections() {
    this.toggleSpinner();
    this.insService.deleteMonthlyInspections(this.currentEmployeeScore, this.currentEmployee['_id']).then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.getEmployees();
      this.toggleSpinner();
    });
  }

  toggleSpinner() {
    this.showSpinner = !this.showSpinner;
    if (this.showSpinner) {
      document.getElementById('body').classList.add('inspection-overlay');
    } else {
      document.getElementById('body').classList.remove('inspection-overlay');
    }
  }

  createInsItems() {
    this.toggleSpinner();
    this.insService.createInsItems().subscribe(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.toggleSpinner();
    });
  }
}
