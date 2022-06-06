import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { SuccessModalComponent } from '../../success-modal/success-modal.component';

@Component({
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.component.html',
  styleUrls: ['./edit-order-dialog.component.css'],
})
export class EditOrderDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingAdd: false,
    loadingPay: false,
    loadingSubmit: false,
    loadingDistBef: false,
  };
  currOrder: Order;
  orderForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditOrderDialogComponent>,
    private deliveriesService: DeliveriesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.currOrder = this.data.currOrder;
    this.orderForm = this.formBuilder.group({
      idDetalle: [this.currOrder.idDetalle],
      nFactura: [this.currOrder.nFactura, [Validators.required]],
      fecha: [
        formatDate(this.currOrder.fechaEntrega, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      hora:[formatDate(this.currOrder.fechaEntrega, 'HH:mm', 'en'),
      [Validators.required]],
      nomDestinatario: [this.currOrder.nomDestinatario, [Validators.required]],
      numCel: [this.currOrder.numCel, [Validators.required]],
      efectivoRecibido: [this.currOrder.efectivoRecibido, [Validators.min(0)]],
      observaciones: [this.currOrder.observaciones],
      instrucciones: [this.currOrder.instrucciones,[Validators.maxLength(150)]]
    });
  }

  ngOnInit(): void {}

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    dialog.afterClosed().subscribe((result) => {
      this.loaders.loadingSubmit = false;
    });
  }

  openSuccessDialog(succsTitle: string, succssMsg: string) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      location.reload();
    });
  }

  onFormSubmit() {
    if (this.orderForm.valid) {
      this.loaders.loadingSubmit = true;
      const deliveriesSubscription = this.deliveriesService
        .updateOrder(this.orderForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;

            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            deliveriesSubscription.unsubscribe();
          },
          (error) => {
            if (error.subscribe()) {
              error.subscribe((error) => {
                this.loaders.loadingSubmit = false;
                this.openErrorDialog(error.statusText);
                deliveriesSubscription.unsubscribe();
              });
            } else {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(
                'Lo sentimos, ha ocurrido un error al actualizar la fecha de entrega. Por favor intenta de nuevo.'
              );
              deliveriesSubscription.unsubscribe();
            }
          }
        );
    } else if (this.orderForm.invalid) {
      let invalidFields = [].slice.call(
        document.getElementsByClassName('ng-invalid')
      );
      invalidFields[1].focus();
    }
  }
}
