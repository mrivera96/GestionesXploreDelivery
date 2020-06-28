import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Delivery} from "../../../../models/delivery";
import {formatDate} from "@angular/common";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {DateValidate} from "../../../../helpers/date.validator";

@Component({
  selector: 'app-change-hour-dialog',
  templateUrl: './change-hour-dialog.component.html',
  styleUrls: ['./change-hour-dialog.component.css']
})
export class ChangeHourDialogComponent implements OnInit {
  loaders = {
    'loadingSubmit': false
  }
  changeForm: FormGroup
  currDelivery: Delivery

  constructor(
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    public dialogRef: MatDialogRef<ChangeHourDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.currDelivery = this.data.delivery
  }

  ngOnInit(): void {
    this.initialize()
  }

  initialize() {
    this.changeForm = this.formBuilder.group({
      idDelivery: [this.currDelivery.idDelivery],
      fecha: [formatDate(new Date(this.currDelivery.fechaReserva), 'yyyy-MM-dd', 'en')],
      hora: [formatDate(new Date(this.currDelivery.fechaReserva), 'HH:mm', 'en')]
    }, {
      validators: DateValidate('fecha', 'hora'),
    })
  }

  get f() {
    return this.changeForm.controls
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

  onEditFormSubmit() {
    if (this.changeForm.valid) {
      this.loaders.loadingSubmit = true
      this.deliveriesService.changeDeliveryHour(this.changeForm.value).subscribe(response => {
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
      }, error => {
        this.loaders.loadingSubmit = false
        this.openErrorDialog('Ha ocurrido un error al cambiar la hora de Delivery. Por favor intenta de nuevo.')
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

}
