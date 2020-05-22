import { Component, OnInit } from '@angular/core';
import {Delivery} from "../../models/delivery";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../services/deliveries.service";

@Component({
  selector: 'app-reservas-maniana',
  templateUrl: './reservas-maniana.component.html',
  styleUrls: ['./reservas-maniana.component.css']
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

    this.deliveriesService.getDeliveries().subscribe( response => {
      if(response.error == 0){
        this.loaders.loadingData = false
        this.deliveries = response.data.deliveriesManiana
        this.dtTrigger.next()
      }
    })
  }

}
