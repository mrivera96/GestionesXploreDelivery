import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from "../../../models/user";
import { UsersService } from "../../../services/users.service";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { EditDriverDialogComponent } from "./edit-driver-dialog/edit-driver-dialog.component";
import { DataTableDirective } from "angular-datatables";
import { NewDriverDialogComponent } from "./new-driver-dialog/new-driver-dialog.component";
import { animate, style, transition, trigger } from "@angular/animations";
import { AgenciesService } from "../../../services/agencies.service";
import { City } from "../../../models/city";
import { DriverCategoriesComponent } from './driver-categories/driver-categories.component';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-xplore-drivers',
  templateUrl: './xplore-drivers.component.html',
  styleUrls: ['./xplore-drivers.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class XploreDriversComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective
  dtOptions: any
  dtTrigger: Subject<any> = new Subject<any>()
  loaders = {
    'loadingData': false
  }
  drivers: User[]
  cities: City[]
  constructor(
    private agenciesService: AgenciesService,
    private usersService: UsersService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      order: [0, 'asc'],
      autoWidth: true,
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
    const agSubs = this.agenciesService.getCities().subscribe(response => {
      this.cities = response.data
      agSubs.unsubscribe()
    })

    const usrSubs = this.usersService.getDrivers().subscribe(response => {
      this.drivers = response.data
      this.dialog.closeAll()
      this.dtTrigger.next()

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

  }

  showEditForm(id) {
    let currDriver: User = {}
    this.drivers.forEach(value => {
      if (value.idUsuario === id) {
        currDriver = value
      }
    })
    const dialogRef = this.dialog.open(EditDriverDialogComponent, {
      data: {
        driver: currDriver
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })

  }

  showNewCustForm() {
    const dialogRef = this.dialog.open(NewDriverDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })
  }

  showCategoriesDialog(driverId) {
    const dialogRef = this.dialog.open(DriverCategoriesComponent, {
      data: {
        driver: driverId
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      /*if (result){
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }*/
      dialogRef.close()
    })
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
