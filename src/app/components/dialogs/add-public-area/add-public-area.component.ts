import { Component, OnInit } from '@angular/core';
import {HkListService} from '../../../services/hk-list.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-add-public-area',
  templateUrl: './add-public-area.component.html',
  styleUrls: ['./add-public-area.component.scss', '../add-dialog.scss']
})
export class AddPublicAreaComponent implements OnInit {
  form: FormGroup;
  areaGroups = [];

  constructor(private hkListService: HkListService, private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddPublicAreaComponent>) {
    this.form = new FormGroup({
      group: new FormControl('', Validators.required),
      area: new FormControl('', Validators.required),
      comments: new FormControl(''),
    });
  }

  ngOnInit() {
    this.getPublicAreaGroups();
  }

  getPublicAreaGroups() {
    this.hkListService.get('areaGroup', {}).then(data => {
      if (data.length > 0) {
        this.areaGroups = data[0].groups;
      }
    });
  }

  handleSubmitForm() {
    if (this.form.valid) {
      this.hkListService.add('publicArea', this.form.value).then(data => {
        this.snackBar.open(data.msg, null, {duration: 2000});
        this.dialogRef.close();
      });
    }
  }

  handleAddNew() {
    const group = prompt('Whats the name of the group?');
    if (group && group !== '') {
      this.hkListService.add('areaGroup', {group}).then(data => {
        this.snackBar.open('New Area group has been added', null, {duration: 2000});
        this.areaGroups.push(group);
      });
    }
  }
}
