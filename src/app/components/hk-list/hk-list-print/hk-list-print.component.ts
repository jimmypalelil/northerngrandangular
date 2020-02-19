import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-hk-list-print',
  templateUrl: './hk-list-print.component.html',
  styleUrls: ['./hk-list-print.component.scss']
})
export class HkListPrintComponent implements OnInit {

  @Input() guestRooms: [];
  @Input() publicAreas: [];
  @Input() task: {};
  @Input() displayDate: string;

  constructor() { }

  ngOnInit() {
  }
}
