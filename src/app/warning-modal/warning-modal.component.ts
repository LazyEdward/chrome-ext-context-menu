import { Component, OnInit } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.css']
})
export class WarningModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WarningModalComponent>) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close("submit");
  }

}
