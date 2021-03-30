import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public dialog: MatDialog,
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

}
