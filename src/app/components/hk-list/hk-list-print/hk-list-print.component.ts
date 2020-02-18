import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-hk-list-print',
  templateUrl: './hk-list-print.component.html',
  styleUrls: ['./hk-list-print.component.scss']
})
export class HkListPrintComponent implements OnInit, OnChanges {

  @Input() guestRooms: [];
  @Input() publicAreas: [];
  @Input() task: {};
  @Input() displayDate: string;

  constructor() { }

  ngOnInit() {
    console.log(this.guestRooms);
    console.log(this.publicAreas);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.guestRooms && changes.guestRooms.currentValue);
    console.log(changes.publicAreas && changes.publicAreas.currentValue);
  }

}
