import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Delivery} from "../../../models/delivery";
import {DeliveryDetail} from "../../../models/delivery-detail";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
declare var $: any
@Component({
  selector: 'app-customer-delivery-detail',
  templateUrl: './customer-delivery-detail.component.html',
  styleUrls: ['./customer-delivery-detail.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerDeliveryDetailComponent implements OnInit {
  currentDelivery: Delivery
  currentDeliveryDetail: DeliveryDetail[]
  deliveryId: number
  loaders = {
    'loadingData': false
  }
  dddtOptions: any
  dddtTrigger: Subject<any>
  errorMSg: string

  constructor(
    private deliveriesService: DeliveriesService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {

    this.initialize()
    this.route.paramMap.subscribe(params => {
      this.deliveryId = Number(params.get("id"));
    })
    this.loaders.loadingData = true
    this.deliveriesService.getById(this.deliveryId).subscribe(response => {
      this.currentDelivery = response.data
      this.currentDeliveryDetail = response.data.detalle
      this.loaders.loadingData = false

    }, error => {
      this.loaders.loadingData = false
      this.errorMSg = 'Lo sentimos, ha ocurrido un error al cargar la información. Por favor intente de nuevo.'
      $("#errModal").modal('show')
    })
    this.loadData()
  }
  initialize() {
    this.dddtOptions =  {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      order: [1, 'asc'],
      responsive: true,
      language: {
        emptyTable: 'No hay datos para mostrar en esta tabla',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        },
      },
    }
    this.dddtTrigger = new Subject()

  }

  loadData() {


  }

}
