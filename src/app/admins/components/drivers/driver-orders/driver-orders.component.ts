import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Delivery } from 'src/app/models/delivery';
import { Order } from 'src/app/models/order';
import { DeliveriesService } from 'src/app/services/deliveries.service';

@Component({
  selector: 'app-driver-orders',
  templateUrl: './driver-orders.component.html',
  styles: [
  ]
})
export class DriverOrdersComponent implements OnInit {
  driverOrders: Order[]
  loading = false
  pendingDeliveries: any []
  driverId: number

  constructor(
    @Inject(MAT_DIALOG_DATA)  private data: any,
    private deliveriesService: DeliveriesService,
    private dialogRef: MatDialogRef<DriverOrdersComponent>
  ) {
    this.dialogRef.disableClose = true
    this.driverId = this.data.driverId
   }

  ngOnInit(): void {
    console.log(this.data)
    this.loadData()
  }

  loadData(){
    this.loading = true
    const delSubsc = this.deliveriesService
    .getDriverPending(this.driverId)
    .subscribe(response => {
      this.pendingDeliveries = response.data

      this.loading = false
      delSubsc.unsubscribe()
    })
  }

}
