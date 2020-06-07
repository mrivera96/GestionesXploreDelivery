import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
declare var $: any

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class HomeCustomerComponent implements OnInit {

  loaders = {
    'loadingData': false
  }
  msgError = ''

  constructor(
  ) {

  }

  deliveries: Delivery[]

  ngOnInit(): void {
    this.loaders.loadingData = true
  }

  setLoading(event) {
    this.loaders.loadingData = event
  }

}
