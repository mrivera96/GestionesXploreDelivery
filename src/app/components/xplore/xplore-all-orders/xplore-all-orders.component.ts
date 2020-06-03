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
  dtTrigger: Subject<any> = new Subject()


  orders: Order[]
  msgError = ''
  constructor(
    private deliveriesService: DeliveriesService,
  ) { }

  ngOnInit(): void {

    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true
    this.deliveriesService.getOrders().subscribe(response => {
      this.orders = response.data.todos
      this.dtTrigger.next()
      this.loaders.loadingData = false
    }, error => {
      this.loaders.loadingData = false
      this.msgError = 'Ha ocurrido un error al cargar los datos. Intente de nuevo recargando la página.'
      $("#errModal").modal('show')
    })

  }

}
