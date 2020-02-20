import { Component, OnInit } from '@angular/core';
import {HkListService} from '../../../services/hk-list.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss', '../add-dialog.scss']
})
export class EditTaskComponent implements OnInit {
  taskList = [];
  areaGroups: string[] = ['guest rooms'];
  frequencyList = ['monthly', 'weekly', 'bi-weekly', 'quarterly', 'bi-yearly', 'yearly'];
  form: FormGroup;

  constructor(private hkListService: HkListService, private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<EditTaskComponent>) {
    this.form = new FormGroup({
      task: new FormControl('', Validators.required),
      frequency: new FormControl('monthly', Validators.required),
      hkAreas: new FormControl([''], Validators.required),
    });

    this.form.get('task').valueChanges.subscribe(val => {
      this.form.get('frequency').setValue(val.frequency);
      this.form.get('hkAreas').setValue(val.hkAreas);
    });
  }

  ngOnInit() {
    this.getTaskList();
    this.getPublicAreaGroups();
  }

  getTaskList() {
    this.hkListService.get('tasks', {}).then(data => {
      this.taskList = data;
    });
  }

  getPublicAreaGroups() {
    this.hkListService.get('areaGroup', {}).then(data => {
      if (data.length > 0) {
        this.areaGroups = this.areaGroups.concat(data[0].groups);
      }
    });
  }

  handleSubmitForm() {
    if (this.form.valid) {
      const taskObj = this.form.value;
      taskObj.task = this.form.value.task.task;
      this.hkListService.add('task', taskObj).then(data => {
        this.snackBar.open(data.msg, null, {duration: 2000});
        this.dialogRef.close(taskObj);
      });
    }
  }
}
