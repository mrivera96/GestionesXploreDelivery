import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-remove',
  templateUrl: './confirm-remove.component.html',
  styles: [
  ]
})
export class ConfirmRemoveComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmRemoveComponent>,
    public dialog: MatDialog,
  ) {
    this.dialogRef.disableClose = true
   }

  ngOnInit(): void {
  }

}
