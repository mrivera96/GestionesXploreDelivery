import {Component, OnInit, ViewChild} from '@angular/core';
import {DeliveriesService} from "../../../services/deliveries.service";
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {Router} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { AgenciesService } from 'src/app/services/agencies.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';
import { City } from 'src/app/models/city';

@Component({
  selector: 'app-pending-deliveries',
  templateUrl: './pending-deliveries.component.html',
  styleUrls: ['./pending-deliveries.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class PendingDeliveriesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  loaders = {
    'loadingData': false
  }
  deliveries: Delivery[] = []
  consolidateDeliveries: Delivery[] = []
  dtTrigger: Subject<any> = new Subject<any>()
  dtTrigger1: Subject<any> = new Subject<any>()
  dtTrigger2: Subject<any> = new Subject<any>()
  dtOptions: any
  dtOptions1: any
  interval
  drivers: User[] = []
  cities: City[] = []

  constructor(
    private deliveriesService: DeliveriesService,
    private router: Router,
    private agenciesService: AgenciesService,
    private usersService: UsersService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
    this.interval = setInterval(() => {
      location.reload()
    }, 60000);

  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [2, 'desc'],
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

    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
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


  }

  loadData() {
    this.openLoader()
    const deliveriesSubscription = this.deliveriesService.getPending().subscribe(response => {
      response.data.forEach(value => {
        if (value.isConsolidada == 0) {
          this.deliveries.push(value)
        } else if (value.isConsolidada == 1) {
          this.consolidateDeliveries.push(value)
        }
      })
      this.dtTrigger.next()
      this.dtTrigger1.next()

      const usrSubs = this.usersService.getDrivers().subscribe(response => {
        this.drivers = response.data
        this.dialog.closeAll()
        this.dtTrigger2.next()
  
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.columns().every(function () {
            const that = this;
            $('select', this.footer()).on('change', function () {
              if (that.search() !== this['value']) {
                that
                  .search(this['value'])
                  .draw();
              }
            })
          })
        })
        usrSubs.unsubscribe()
      })

      deliveriesSubscription.unsubscribe()

    })

    const agSubs = this.agenciesService.getCities().subscribe(response => {
      this.cities = response.data
      agSubs.unsubscribe()
    })

  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }


}
