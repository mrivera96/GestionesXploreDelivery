import {Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {Order} from "../../../models/order";
import {DeliveriesService} from "../../../services/deliveries.service";
declare var $: any
@Component({
  selector: 'app-xplore-all-orders',
  templateUrl: './xplore-all-orders.component.html',
  styleUrls: ['./xplore-all-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreAllOrdersComponent implements OnInit {
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
