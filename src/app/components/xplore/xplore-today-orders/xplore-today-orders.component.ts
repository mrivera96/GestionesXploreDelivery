import { Component, OnInit } from '@angular/core';
import {Subject} from "rxjs";
import {Order} from "../../../models/order";
import {DeliveriesService} from "../../../services/deliveries.service";
import {animate, style, transition, trigger} from "@angular/animations";
declare var $: any
@Component({
  selector: 'app-xplore-today-orders',
  templateUrl: './xplore-today-orders.component.html',
  styleUrls: ['./xplore-today-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreTodayOrdersComponent implements OnInit {
  loaders = {
    'loadingData': false
  }

  constructor(

  ) { }

  ngOnInit(): void {
    this.loaders.loadingData = true
  }

  setLoading(event){
    this.loaders.loadingData = event
  }

}
