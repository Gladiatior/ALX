import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

interface FilterDialogClass {
  name: string;
  ok: boolean;
  close: boolean;
  SPR: string;
}
@Component({
  selector: 'app-filter-name-spr',
  templateUrl: './filter-name-spr.component.html',
  styleUrls: ['../../assets/styles/spravochnikFilte.css']
})
export class FilterNameSprComponent implements OnInit {
  name = false;

  constructor(
    public dialogRef: MatDialogRef<FilterNameSprComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterDialogClass) {
  }

  onCloseClick() {
    this.data.close = true;
    this.data.ok = false;
    this.dialogRef.close(this.data);
  }

  onOk() {
    this.data.ok = true;
    this.data.close = false;
    this.dialogRef.close(this.data);
  }

  ngOnInit() {
    if (this.data.name) {
      this.name = true;
    } else {
      this.name = false;
    }
  }

  onSelectNomi() {
    if (this.name) {
      this.data.name = '';
    }
  }

}
