import { Component, OnInit } from '@angular/core';
import {DeliveriesService} from "../../services/deliveries.service";
import {Delivery} from "../../models/delivery";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ver-solicitud',
  templateUrl: './ver-solicitud.component.html',
  styleUrls: ['./ver-solicitud.component.css']
})
export class VerSolicitudComponent implements OnInit {
  currentDelivery: Delivery
  deliveryId: number
  constructor(private deliveriesService: DeliveriesService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.deliveryId =  Number(params.get("id"));
    });
    this.deliveriesService.getById(this.deliveryId).subscribe(response => {
      this.currentDelivery = response.data
    })
  }

}
