import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
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
