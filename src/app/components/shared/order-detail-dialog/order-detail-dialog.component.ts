import {Component, Inject, OnInit} from '@angular/core';
import {Order} from "../../../models/order";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AssignDriverComponent} from "../assign-driver/assign-driver.component";
import {AddOrderExtrachargeDialogComponent} from "../add-order-extracharge-dialog/add-order-extracharge-dialog.component";
import {ChangeOrderStateDialogComponent} from "../change-order-state-dialog/change-order-state-dialog.component";
import {User} from "../../../models/user";

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styles: [
  ]
})
export class OrderDetailDialogComponent implements OnInit {
  currentOrder: Order = {}
  currentUser: User = {}

  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) {
    this.currentOrder = this.data.currentOrder
    this.currentUser = this.data.currentUser
  }

  ngOnInit(): void {
  }

  showAssignDriverDialog(currOrder){
    const dialogRef = this.dialog.open(AssignDriverComponent,
      {
        data: {
          order: currOrder.idDetalle
        }
      }
    )

    dialogRef.afterClosed().subscribe(result => {
      location.reload()
    })


  }

  showAddExtrachargeDialog(currOrder){
    const dialogRef = this.dialog.open(AddOrderExtrachargeDialogComponent,
      {
        data: {
          order: currOrder
        }
      }
    )

    dialogRef.afterClosed().subscribe(result => {
      location.reload()
    })


  }
  showChangeStateDialog(currOrder) {
    const dialogRef = this.dialog.open(ChangeOrderStateDialogComponent,
      {
        data: {
          order: currOrder
        }
      }
    )

    dialogRef.afterClosed().subscribe(result => {
      location.reload()
    })

  }

}
