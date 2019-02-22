import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {InspectionService} from '../services/inspection.service';
import {Inspection} from '../models/inspection';
import {MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {environment} from '../../environments/environment';
import {Employee} from '../models/employee';
import {InspectionScore} from '../models/inspectionScore';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.scss']
})
export class InspectionComponent implements OnInit, AfterViewInit {
  employees: any[];
  currentEmployee: any;
  selectedEmployees: any;
  currentInspection: Inspection;
  newInspectionDate: Date;
  currentEmployeeScore: any;
  months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  panelOpened: boolean;
  insItems: any[];
  inspectionScores: {};
  employeeScores: MatTableDataSource<any>;
  employeeInspections: MatTableDataSource<any>;
  inspectionItems: any;
  showInspectionsForMonth = false;
  showInspection = false;
  showInspectionForm = false;
  MonthInspectionsDisplayedColumns = ['month', 'year', 'num_inspections', 'score', 'action'];
  dailyInspectionsDisplayedColumns = ['room_number', 'day', 'score', 'action'];
  scoreCategory = ['Bad', 'Needs Improvement', 'Good', 'Excellent'];
  currentEmployeeIndex: number;
  totalScore: number;
  totalItems: number;
  catScores: number[] = [];
  showSpinner = false;
  tableExpanded = true;

  constructor(private insService: InspectionService, public snackBar: MatSnackBar) {
    this.panelOpened = false;
    this.currentInspection = new Inspection();
    this.currentEmployee = new Employee();
  }

  @ViewChild(MatSort) sort: MatSort;

  @Output() spinnerEvent = new EventEmitter<boolean>();

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.getEmployees();
    }, 1000);
  }

  isHK(): boolean {
    const email = localStorage.getItem('token');
    return email === 'housekeeping@northerngrand.ca' || email === 'tester@test.com' || email === 'jimmypalelil@gmail.com';
  }

  getEmployees() {
    this.toggleSpinner();
    this.insService.getEmployees().then(data => {
      this.employees = data;
      if (this.currentEmployeeIndex === undefined) {
        this.currentEmployeeIndex = 0;
      }
      this.getEmployeeIns(data[this.currentEmployeeIndex], 0);
      this.toggleSpinner();
    });
  }

  getEmployeeIns(employee, index) {
    if (employee !== this.currentEmployee) {
      this.showInspectionsForMonth = false;
      this.showInspection = false;
      this.showInspectionForm = false;
      this.currentEmployee = employee;
      this.currentEmployeeIndex = index;
      this.insService.getEmployeeIns(employee['_id']).then(data => {
        this.employeeScores = new MatTableDataSource(data[0]['Monthly Scores']);
        this.employeeScores.sort = this.sort;

        const monthTable = document.getElementById('ins-monthly') as HTMLElement;
        const insTable = document.getElementById('ins-tables') as HTMLElement;
        if (monthTable !== null) {
          monthTable.classList.remove('ins-monthly-slide');
          insTable.classList.remove('ins-table-slide');
        }
        const scoresColumn = document.querySelectorAll('#ins-monthly .mat-column-score');
        const numInspectionColumn = document.querySelectorAll('#ins-monthly .mat-column-num_inspections');
        if (scoresColumn !== null) {
          const nodeArray = [];
          for (let i = 0; i < scoresColumn.length; i++) {
            nodeArray.push(scoresColumn[i]);
            nodeArray.push(numInspectionColumn[i]);
          }
          nodeArray.forEach((column) => {
            if (column !== undefined) {
              const scoreColumn = column as HTMLElement;
              scoreColumn.style.display = 'flex';
            }
          });
        }
      });
    }
  }

  startNewInspection() {
    this.panelOpened = false;
    if (this.isHK()) {
      this.toggleSpinner();
      try {
        if (isNaN(this.currentInspection.room_number) || this.currentInspection.room_number === null) {
          throw Error();
        }
        this.currentInspection.day = this.newInspectionDate.getDate();
        this.currentInspection.month = this.months[this.newInspectionDate.getMonth()];
        this.currentInspection.year = this.newInspectionDate.getFullYear();
        const ids = [];
        this.selectedEmployees.forEach(function (employee) {
          ids.push(employee['_id']);
        });
        this.insService.startNewInspection(this.currentInspection, ids).then(data => {
          this.insItems = data;
          this.inspectionScores = {};
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i]['items'].length; j++) {
              this.inspectionScores[data[i]['items'][j]['_id']] = new InspectionScore(-1);
            }
          }
          this.totalItems = this.totalScore = 0;
          this.showInspection = this.showInspectionsForMonth = false;
          this.showInspectionForm = true;
          this.toggleSpinner();
        }).catch(() => {
          this.snackBar.open('Connection Error...Try AGAIN!!!', '', {
            duration: 2000,
          });
        });
      } catch (e) {
        this.snackBar.open('Oops!!! Looks like you forgot to add some details. Try Again!!!', '', {
          duration: 2000,
        });
        this.toggleSpinner();
      }
    } else {
      this.snackBar.open('Only Housekeeping Department can Inspect Rooms', '', {
        duration: 2000,
      });
    }
  }

  submitInspection() {
    this.toggleSpinner();
    this.insService.sendInspection(this.currentInspection, this.inspectionScores, this.selectedEmployees).then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.getEmployees();
      this.insItems = undefined;
      this.showInspectionForm = false;
    }).catch(() => {
      this.snackBar.open('Connection Error....Try AGAIN!!!', '', {
        duration: 2000,
      });
    }).then(() => this.toggleSpinner());
  }

  isAdmin(): boolean {
    const email = localStorage.getItem('token');
    return email === 'jimmypalelil@gmail.com' || email === 'tester@test.com';
  }

  resetInspections() {
    this.toggleSpinner();
    this.insService.resetInspections().then(msg => {
      location.reload();
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.toggleSpinner();
    });
  }

  viewInspections(monthInspection) {
    // adding 3d effect
    const monthTable = document.getElementById('ins-monthly') as HTMLElement;
    monthTable.classList.add('ins-monthly-slide');
    const scoresColumn = document.querySelectorAll('#ins-monthly .mat-column-score');
    const numInspectionColumn = document.querySelectorAll('#ins-monthly .mat-column-num_inspections');
    let scoreColumn;
    const nodeArray = [];
    for (let i = 0; i < scoresColumn.length; i++) {
      // nodeArray.push(scoresColumn[i]);
      nodeArray.push(numInspectionColumn[i]);
    }
    nodeArray.forEach((column) => {
      scoreColumn = column as HTMLElement;
      if (scoreColumn !== undefined) {
        scoreColumn.style.display = 'none';
      }
    });

    this.currentEmployeeScore = monthInspection;
    this.insService.getInspections(this.currentEmployee['_id'], monthInspection['month'], monthInspection['year']).then(data => {
      this.showInspectionsForMonth = true;
      this.showInspection = false;
      this.showInspectionForm = false;
      this.employeeInspections = new MatTableDataSource(data);
      this.sort.active = 'day';
      this.sort.direction = 'desc';
      this.employeeInspections.sort = this.sort;
    });
  }

  sortData(dataSource, event) {
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    dataSource.sort = this.sort;
  }

  viewInspection(inspection) {
    // adding 3d effect
    const dailyTable = document.getElementById('ins-daily') as HTMLElement;
    dailyTable.classList.add('ins-daily-slide');
    const insTable = document.getElementById('ins-tables') as HTMLElement;
    insTable.classList.add('ins-table-slide');

    this.currentInspection = inspection;
    this.insService.getInspection(inspection['_id'], this.currentEmployee['_id']).then(data => {
      this.showInspection = true;
      this.showInspectionForm = false;
      this.inspectionItems = data;
      for (let i = 0; i < data.length; i++) {
        const items = data[i].items;
        let totScore = 0, count = 0;
        items.forEach(function(item) {
          if (item.item.score !== -1) {
            totScore += item.item.score;
            count++;
          }
        });
        if (count === 0) {
          this.catScores[i] = -1;
        } else {
          this.catScores[i] = totScore / count;
        }
      }
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
    this.spinnerEvent.emit(this.showSpinner);
  }

  createInsItems() {
    this.toggleSpinner();
    this.insService.createInsItems().then(msg => {
      this.snackBar.open(msg['text'].toUpperCase(), '', {
        duration: 2000,
      });
      this.toggleSpinner();
    });
  }

  insertScore(itemID, event) {
    this.inspectionScores[itemID].score = event.value;
    this.totalItems = 0;
    this.totalScore = 0;
    for (const key in this.inspectionScores) {
      const score = this.inspectionScores[key].score;
      if (score !== -1) {
        this.totalScore += Number(score);
        this.totalItems++;
      }
    }
  }

  insertComment(itemID, event) {
    this.inspectionScores[itemID].comment = event.target.value;
  }

  floor(n: number) {
    return Math.floor(n);
  }

  isProduction() {
    return environment.production;
  }

  toggleMenu() {
    const menu = document.getElementsByClassName('menu')[0] as HTMLElement;
    const menuBtn = document.getElementsByClassName('bottom-menu-button')[0] as HTMLElement;
    const menuBar = document.getElementsByClassName('bottom-menu')[0] as HTMLElement;

    menu.classList.toggle('menu-show');
    menuBtn.classList.toggle('bottom-menu-button-clicked');
    menuBar.classList.toggle('bottom-menu-clicked');
  }

  toggleNewInspectionPanel() {
    this.panelOpened = !this.panelOpened;
  }

  createScoreArray(number: number) {
    if (number > 0) {
      return Array(number);
    }
  }
}
