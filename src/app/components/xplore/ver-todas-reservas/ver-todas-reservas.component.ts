import { Component, OnInit } from '@angular/core';
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-ver-todas-reservas',
  templateUrl: './ver-todas-reservas.component.html',
  styleUrls: ['./ver-todas-reservas.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class VerTodasReservasComponent implements OnInit {

  deliveries: Delivery[]
  dtTrigger: Subject<any> = new Subject()
  loaders = {
    loadingData: false
  }
  dtOptions: DataTables.Settings
  constructor(
    private deliveriesService: DeliveriesService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loaders.loadingData = true

    this.deliveriesService.getDeliveries().subscribe( response => {

        this.loaders.loadingData = false
        this.deliveries = response.data.todas

        this.dtTrigger.next()

    })

  }


}
