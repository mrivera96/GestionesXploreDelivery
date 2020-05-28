import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {AuthService} from "../../../services/auth.service";
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {AppComponent} from "../../../app.component";
import {ActivatedRoute} from "@angular/router";

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
  dtTrigger: Subject<any> = new Subject()

  constructor(private authService: AuthService,
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
      this.deliveries = response.data.deliveriesDia
      this.dtTrigger.next()
      this.loaders.loadingData = false
    })


  }

}
