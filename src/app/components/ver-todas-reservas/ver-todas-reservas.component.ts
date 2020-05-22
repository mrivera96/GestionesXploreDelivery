import { Component, OnInit } from '@angular/core';
import {DeliveriesService} from "../../services/deliveries.service";
import {Delivery} from "../../models/delivery";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-ver-todas-reservas',
  templateUrl: './ver-todas-reservas.component.html',
  styleUrls: ['./ver-todas-reservas.component.css']
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

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      order:[2,'desc'],
      autoWidth:true,
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

    this.deliveriesService.getDeliveries().subscribe( response => {
      if(response.error == 0){
        this.loaders.loadingData = false
        this.deliveries = response.data.todas
        this.dtTrigger.next()
      }
    })


  }

  verSolicitud(id) {
    this.router.navigate(['ver-solicitud', id])
  }

}
