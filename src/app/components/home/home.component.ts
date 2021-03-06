import {Component, OnInit} from '@angular/core';
import {DeliveriesService} from "../../services/deliveries.service";
import {Delivery} from "../../models/delivery";
import {Subject} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

  loadData(){
    this.loaders.loadingData = true
    this.deliveriesService.getDeliveries().subscribe(response => {
      if (response.error == 0) {
        this.deliveries = response.data.deliveriesDia
        this.dtTrigger.next()
        this.loaders.loadingData = false
      }
    })
  }

}
