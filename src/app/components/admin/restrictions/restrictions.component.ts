import {Component, OnInit, ViewChild} from '@angular/core';
import {RestrictionsService} from "../../../services/restrictions.service";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {LoadingDialogComponent} from "../../shared/loading-dialog/loading-dialog.component";
import {Restriction} from "../../../models/restriction";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {animate, style, transition, trigger} from "@angular/animations";
import {EditRestrictionDialogComponent} from "./edit-restriction-dialog/edit-restriction-dialog.component";
import {CreateRestrictionDialogComponent} from "./create-restriction-dialog/create-restriction-dialog.component";

@Component({
  selector: 'app-restrictions',
  templateUrl: './restrictions.component.html',
  styleUrls: ['./restrictions.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class RestrictionsComponent implements OnInit {

  restrictions: Restriction[]
  dtTrigger: Subject<any>
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective
  dtOptions


  constructor(
    private restrictionsService: RestrictionsService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
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
    this.openLoader()
    const restSubsc = this.restrictionsService.getRestrictions()
      .subscribe(response => {
        this.restrictions = response.data

        this.dialog.closeAll()
        this.dtTrigger.next()
        restSubsc.unsubscribe()

      }, error => {
        error.subscribe(err => {
          this.openErrorDialog(err.statusText, false)
          restSubsc.unsubscribe()
        })
      })

  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.ngOnInit()
      })
    }

  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

  openEditDialog(currRestriction): void {
    const dialogRef = this.dialog.open(EditRestrictionDialogComponent, {
      data: {
        restriction: currRestriction
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

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateRestrictionDialogComponent)

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

}
