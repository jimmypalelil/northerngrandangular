import {Component, Input, OnInit} from '@angular/core';
import {Task} from '../../../models/Task';

@Component({
  selector: 'app-hk-list-print',
  templateUrl: './hk-list-print.component.html',
  styleUrls: ['./hk-list-print.component.scss']
})
export class HkListPrintComponent implements OnInit {

  @Input() task: Task;

  constructor() { }

  ngOnInit() {
  }
}
