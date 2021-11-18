import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styles: [
  ]
})
export class ConfirmationDialogComponent implements OnInit {
  icon: string;
  question: string;

  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.dialogRef.disableClose = true;
    this.icon = this.data.icon;
    this.question = this.data.question;
   }

  ngOnInit(): void {
  }

}
