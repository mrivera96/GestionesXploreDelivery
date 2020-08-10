import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {ExtraCharge} from "../../../models/extra-charge";
import {ExtraChargesService} from "../../../services/extra-charges.service";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {EditExtraChargeDialogComponent} from "./edit-extra-charge-dialog/edit-extra-charge-dialog.component";
import {NewExtraChargeDialogComponent} from "./new-extra-charge-dialog/new-extra-charge-dialog.component";
import { ExtraChargeCategoriesComponent } from './extra-charge-categories/extra-charge-categories.component';
import {ExtraChargesOptionsDialogComponent} from "./extra-charges-options-dialog/extra-charges-options-dialog.component";

@Component({
  selector: 'app-extra-charges',
  templateUrl: './extra-charges.component.html',
  styleUrls: ['./extra-charges.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class ExtraChargesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  dtOptions
  dtTrigger: Subject<any>
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  extraCharges: ExtraCharge[]

  constructor(
    private extraChargesService: ExtraChargesService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize(){
    this.dtTrigger = new Subject<any>()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
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

  loadData(){
    this.loaders.loadingData = true
    const extraChargesSubscription = this.extraChargesService.getExtraCharges().subscribe(response => {
      this.extraCharges = response.data
      this.loaders.loadingData = false
      this.dtTrigger.next()
      extraChargesSubscription.unsubscribe()
    })
  }

  showEditForm(id) {
    let currExtraCharge: ExtraCharge = {}
    this.extraCharges.forEach(value => {
      if (value.idCargoExtra === id) {
        currExtraCharge = value
      }
    })
    const dialogRef = this.dialog.open(EditExtraChargeDialogComponent, {
      data: {
        extraCharge: currExtraCharge
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })
  }

  showNewForm() {
    const dialogRef = this.dialog.open(NewExtraChargeDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if(reload){
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.ngOnInit()
      })
    }

  }

  showExtraChargeCategories(id) {
    this.dialog.open(ExtraChargeCategoriesComponent, {
      data: {
        extraChargeId: id
      }
    })
  }

  showExtraChargeOptions(id) {
    this.dialog.open(ExtraChargesOptionsDialogComponent, {
      data: {
        extraChargeId: id
      }
    })
  }

}
