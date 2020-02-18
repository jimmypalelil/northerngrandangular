import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HkListService} from '../../../services/hk-list.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['../add-dialog.scss']
})
export class AddTaskComponent implements OnInit {
  form: FormGroup;
  areaGroups: string[] = ['guest rooms'];
  operationList = ['monthly', 'weekly', 'bi-weekly', 'quarterly', 'bi-yearly', 'yearly'];

  constructor(private hkListService: HkListService, private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddTaskComponent>) {
    this.form = new FormGroup({
      task: new FormControl(null, Validators.required),
      frequency: new FormControl('monthly', Validators.required),
      hkAreas: new FormControl(['guestRooms'], Validators.required),
    });
  }

  ngOnInit() {
    this.getPublicAreaGroups();
  }

  getPublicAreaGroups() {
    this.hkListService.get('areaGroup', {}).then(data => {
      if (data.length > 0) {
        this.areaGroups = this.areaGroups.concat(data[0].groups);
        console.log(this.areaGroups);
      }
    });
  }
  handleSubmitForm() {
    if (this.form.valid) {
      this.hkListService.add('task', this.form.value).then(data => {
        this.snackBar.open(data.msg, null, {duration: 2000});
        this.dialogRef.close(this.form.value);
      });
    }
  }
}
