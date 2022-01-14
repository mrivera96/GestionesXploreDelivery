import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Delivery } from 'src/app/models/delivery';
import { DeliveryDetail } from 'src/app/models/delivery-detail';
import { Order } from 'src/app/models/order';
import { DeliveriesService } from 'src/app/services/deliveries.service';

@Component({
  selector: 'app-shuttle-details',
  templateUrl: './shuttle-details.component.html',
  styleUrls: ['./shuttle-details.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ShuttleDetailsComponent implements OnInit {
  currentShuttle: Delivery;
  currentOrder: DeliveryDetail;
  id: number;
  loading = false;
  paymentDetails;

  constructor(
    private deliveriesService: DeliveriesService,
    public dialogRef: MatDialogRef<ShuttleDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,

  ) {
    this.id = this.data.shuttleId;
    this.paymentDetails = this.data.paymentData;
  }

  ngOnInit(): void {
    this.loading = true;
    const shuttlSubsc = this.deliveriesService
      .getshuttleDetails(this.id)
      .subscribe((response) => {
        this.currentShuttle = response.data;
        this.currentOrder = this.currentShuttle.detalle[0];
        this.loading = false;
        shuttlSubsc.unsubscribe();
      });
  }

  print() {
    window.print();
  }

  
}
