import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cancel-dialog',
  templateUrl: './confirm-cancel-dialog.component.html',
  styleUrls: ['./confirm-cancel-dialog.component.css']
})
export class ConfirmCancelDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmCancelDialogComponent>,
    public dialog: MatDialog,
  ) {
    this.dialogRef.disableClose = true;
   }

  ngOnInit(): void {
  }

}
