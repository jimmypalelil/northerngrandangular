import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ListService} from '../services/list.service';

@Component({
  selector: 'app-updatelost',
  templateUrl: './updatelost.component.html',
  styleUrls: ['./updatelost.component.scss']
})
export class UpdatelostComponent implements OnInit {

  constructor(private listService: ListService) { }

  @Input() item: any;
  @Output() cancelled = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();

  ngOnInit() {
  }

  isHk(): boolean {
    return localStorage.getItem('token') !== 'reservations@northerngrand.ca';
  }
}
