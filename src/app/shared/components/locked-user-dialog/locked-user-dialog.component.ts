import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AuthService} from "../../../services/auth.service";
import {Customer} from "../../../models/customer";

@Component({
  selector: 'app-locked-user-dialog',
  templateUrl: './locked-user-dialog.component.html',
  styleUrls: ['./locked-user-dialog.component.css']
})
export class LockedUserDialogComponent implements OnInit {

  balance: number = 0
  customer: Customer
  constructor(
    public dialogRef: MatDialogRef<LockedUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dialogRef.disableClose = true
    this.balance = this.data.balance
    this.customer = this.data.customer
  }

  ngOnInit(): void {
  }

}