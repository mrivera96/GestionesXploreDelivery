import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerChooseComponent } from './customer-choose/customer-choose.component';
import {Customer} from "../../../models/customer";

@Component({
  selector: 'app-xplore-add-delivery',
  templateUrl: './xplore-add-delivery.component.html',
  styleUrls: ['./xplore-add-delivery.component.css']
})
export class XploreAddDeliveryComponent implements OnInit {
  customer: Customer
  delType: number

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.openCustomerChooseDialog()
  }

  openCustomerChooseDialog(){
    const dialogRef = this.dialog.open(CustomerChooseComponent)

    dialogRef.afterClosed().subscribe(result => {
      this.customer = result.customer
      this.delType = result.delType
    })
  }

}
