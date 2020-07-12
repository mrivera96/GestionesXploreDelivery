import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../error-modal/error-modal.component";
import {SuccessModalComponent} from "../../success-modal/success-modal.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {State} from "../../../../models/state";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {Order} from "../../../../models/order";
import {DeliveryDetail} from "../../../../models/delivery-detail";

@Component({
  selector: 'app-change-order-state-dialog',
  templateUrl: './change-order-state-dialog.component.html',
  styleUrls: ['./change-order-state-dialog.component.css']
})
export class ChangeOrderStateDialogComponent implements OnInit {
  loaders = {
    'loadingSubmit': false
  }
  changeForm: FormGroup
  states: State[]
  currentOrder: DeliveryDetail

  constructor(
    public dialogRef: MatDialogRef<ChangeOrderStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService
  ) {
    this.currentOrder = data.order
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.changeForm = this.formBuilder.group({
      idEstado: [this.currentOrder.idEstado, [Validators.required]],
      observaciones: ['']
    })
  }

  loadData() {
    this.deliveriesService.getStates().subscribe(response => {
      this.states = response.data.xploreDeliveryEntregas
    })
  }

  changeState() {
    if (this.changeForm.valid) {
      this.loaders.loadingSubmit = true
      this.deliveriesService.changeOrderState(this.currentOrder.idDetalle,
        this.changeForm.get('idEstado').value,
        this.changeForm.get('observaciones').value)
        .subscribe(response => {
          this.loaders.loadingSubmit = false
          this.openSuccessDialog('Operación Realizada Correctamente', response.data)
        }, error => {
          if (error.subscribe()) {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
            })
          }
        })
    }

  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(true)
    })
  }

}
