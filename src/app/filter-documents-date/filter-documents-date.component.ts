import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

interface FilterDialogClass {
  start: Date;
  end: Date;
  ok: boolean;
  close: boolean;
}

@Component({
  selector: 'app-filter-documents-date',
  templateUrl: './filter-documents-date.component.html',
  styleUrls: ['../../assets/styles/spravochnikFilte.css']
})
export class FilterDocumentsDateComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<FilterDocumentsDateComponent>,
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

  }


}
