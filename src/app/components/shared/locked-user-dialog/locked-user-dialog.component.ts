import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-locked-user-dialog',
  templateUrl: './locked-user-dialog.component.html',
  styleUrls: ['./locked-user-dialog.component.css']
})
export class LockedUserDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LockedUserDialogComponent>
  ) { 
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
  }

}
