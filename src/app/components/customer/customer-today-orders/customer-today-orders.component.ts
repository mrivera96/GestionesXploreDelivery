import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import { Order } from "../../../models/order";
declare var $: any
@Component({
  selector: 'app-customer-today-orders',
  templateUrl: './customer-today-orders.component.html',
  styleUrls: ['./customer-today-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerTodayOrdersComponent implements OnInit {
  loaders = {
    'loadingData': false
  }


  constructor(
    private deliveriesService: DeliveriesService,
  ) { }

  ngOnInit(): void {
    this.loaders.loadingData = true
  }


  setLoading(event) {
    this.loaders.loadingData = event
  }
}
