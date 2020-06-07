import { Component, OnInit } from '@angular/core';
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-reservas-maniana',
  templateUrl: './reservas-maniana.component.html',
  styleUrls: ['./reservas-maniana.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class ReservasManianaComponent implements OnInit {
  deliveries: Delivery[]
  dtTrigger: Subject<any> = new Subject()
  loaders = {
    loadingData: false
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
