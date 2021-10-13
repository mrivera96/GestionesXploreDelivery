import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Label } from 'src/app/models/label';
import { AuthService } from 'src/app/services/auth.service';
import { LabelsService } from 'src/app/services/labels.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { ConfirmDialogComponent } from '../branch-offices/confirm-dialog/confirm-dialog.component';
import { AddLabelComponent } from './add-label/add-label.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { EditLabelComponent } from './edit-label/edit-label.component';
import {LoadingDialogComponent} from "../../../shared/components/loading-dialog/loading-dialog.component";

@Component({
  selector: 'app-customer-labels',
  templateUrl: './customer-labels.component.html',
  styleUrls: ['./customer-labels.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CustomerLabelsComponent implements OnInit {
  myLabels: Label[] = []
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  bdtTrigger: Subject<any> = new Subject()
  bdtOptions
  confMsg = ''
  labelToDelete = null

  constructor(
    private authService: AuthService,
    private labelsService: LabelsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.bdtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
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
    this.loadData()
  }

  loadData() {
    this.openLoader()
    const lblSubsc = this.labelsService.getMyLabels()
      .subscribe(response => {
        this.myLabels = response.data
        this.dialog.closeAll()
        this.bdtTrigger.next()
        lblSubsc.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.dialog.closeAll()
          this.openErrorDialog(error.statusText, true)
        })
      })
  }

  showEditForm(id) {
    let currLabel: Label = {}
    this.myLabels.forEach(value => {
      if (value.idEtiqueta === id) {
        currLabel = value
      }
    })
    this.openEditDialog(currLabel)
  }

  openEditDialog(label) {
    const dialogRef = this.dialog.open(EditLabelComponent, {
      data: {
        label: label
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

  reloadData() {
    location.reload(true)
  }

  showConfirmDelete(id) {
    let currLabel: Label = {}

    this.myLabels.forEach(value => {
      if (value.idEtiqueta === id) {
        currLabel = value
      }
    })
    this.labelToDelete = currLabel.idEtiqueta
    this.confMsg = '¿Estás seguro de eliminar la etiqueta ' + currLabel.descEtiqueta + '?'
    this.openConfirmDialog(id, this.confMsg)
  }

  showNewForm() {
    const dialogRef = this.dialog.open(AddLabelComponent)

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

  openConfirmDialog(id, msg) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        labelToDelete: id,
        confMsg: msg
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

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.reloadData()
      })
    }

  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
