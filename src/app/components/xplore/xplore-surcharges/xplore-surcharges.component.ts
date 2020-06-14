import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../models/customer";
import {SurchargesService} from "../../../services/surcharges.service";
import {UsersService} from "../../../services/users.service";
import {Surcharge} from "../../../models/surcharge";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {EditSurchargeDialogComponent} from "./edit-surcharge-dialog/edit-surcharge-dialog.component";
import {NewSurchargeDialogComponent} from "./new-surcharge-dialog/new-surcharge-dialog.component";
declare var $: any

@Component({
  selector: 'app-xplore-surcharges',
  templateUrl: './xplore-surcharges.component.html',
  styleUrls: ['./xplore-surcharges.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreSurchargesComponent implements OnInit {
  dtOptions
  dtTrigger: Subject<any>
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }

  surcharges: Surcharge[]
  constructor(
    private surchargesService: SurchargesService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
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

  loadData() {
    this.surchargesService.getSurcharges().subscribe(response => {
      this.surcharges = response.data
      this.dtTrigger.next()
    }, error => {
      this.loaders.loadingData = false
      this.openErrorDialog("Lo sentimos, ha ocurrido un error al cargar los datos de recargos. Al dar clic en Aceptar, volveremos a intentarlo", true)
    })

  }

  reloadData() {
    this.ngOnInit()
  }

  showEditForm(id) {
    let currSurcharge: Surcharge = {}
    this.surcharges.forEach(value => {
      if (value.idRecargo === id) {
        currSurcharge = value
      }
    })
    this.dialog.open(EditSurchargeDialogComponent, {
      data: {
        surcharge: currSurcharge
      }
    })
  }

  showNewForm() {
    this.dialog.open(NewSurchargeDialogComponent)
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
        this.reloadData()
      })
    }

  }

}
