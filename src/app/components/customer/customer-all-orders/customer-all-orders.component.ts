import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-customer-all-orders',
  templateUrl: './customer-all-orders.component.html',
  styleUrls: ['./customer-all-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerAllOrdersComponent implements OnInit {

  loaders = {
    'loadingData': false
  }

  constructor(
  ) { }

  ngOnInit(): void {
    this.loaders.loadingData = true
  }

  setLoading(event) {
    this.loaders.loadingData = event
  }



}
