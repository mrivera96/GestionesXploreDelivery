import { Component, OnInit } from '@angular/core';
import {DeliveriesService} from "../../services/deliveries.service";
import {Delivery} from "../../models/delivery";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private deliveriesService: DeliveriesService,
    private router: Router
  ) { }

  deliveries: Delivery[]

  ngOnInit(): void {
    this.deliveriesService.getDeliveries().subscribe(response => {
      if(response.error == 0){
        this.deliveries = response.data
      }
    })
  }

  verSolicitud(id){
    this.router.navigate(['ver-solicitud',id])
  }



}
