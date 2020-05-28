import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-todos-deliveries',
  templateUrl: './todos-deliveries.component.html',
  styleUrls: ['./todos-deliveries.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class TodosDeliveriesComponent implements OnInit {

  loaders = {
    'loadingData': false
  }
  dtTrigger: Subject<any> = new Subject()

  constructor(
    private deliveriesService: DeliveriesService,
  ) {

  }

  deliveries: Delivery[]

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true
    this.deliveriesService.getCustomerDeliveries().subscribe(response => {
      this.deliveries = response.data.todas
      this.dtTrigger.next()
      this.loaders.loadingData = false

    })
  }

}
