import {Component, OnInit} from '@angular/core';
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  loaders = {
    'loadingData': false
  }

  constructor() {

  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true

  }

  setLoading(event) {
    this.loaders.loadingData = event
  }

}
