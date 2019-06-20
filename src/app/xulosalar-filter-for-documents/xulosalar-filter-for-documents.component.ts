import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectionList} from "@angular/material";

interface XulosalarDialogClass {
  nameXulosa: String;
  xulosalar: any;
  clickXulosa: any;
  matIcons: String;
  ok: boolean;
  close: boolean;
}
@Component({
  selector: 'app-xulosalar-filter-for-documents',
  templateUrl: './xulosalar-filter-for-documents.component.html',
  styleUrls: ['../../assets/styles/spravochnikFilte.css']
})
export class XulosalarFilterForDocumentsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<XulosalarFilterForDocumentsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: XulosalarDialogClass) { }
  @ViewChild('shoes') selectedRef: MatSelectionList;
  anySelect: any[] =[];

  onCloseClick() {
    this.data.close = true;
    this.data.ok = false;
    this.dialogRef.close(this.data);
  }

  onOk() {
    this.data.ok = true;
    this.data.close = false;
    for (let vaule of this.selectedRef.selectedOptions.selected) {
      this.anySelect.push(vaule.value);
    }
    if (this.anySelect.length) {
      this.data.clickXulosa = this.anySelect;
    } else {
      this.data.clickXulosa = undefined;
    }
    this.dialogRef.close(this.data);
  }



  ngOnInit() {
  }

}
