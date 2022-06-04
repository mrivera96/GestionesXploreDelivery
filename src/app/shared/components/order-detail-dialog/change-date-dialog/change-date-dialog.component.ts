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
  selector: 'app-change-date-dialog',
  templateUrl: './change-date-dialog.component.html',
  styleUrls: ['./change-date-dialog.component.css'],
})
export class ChangeDateDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingAdd: false,
    loadingPay: false,
    loadingSubmit: false,
    loadingDistBef: false,
  };
  dateForm: FormGroup;

  currOrder: Order;
  constructor(
    public dialogRef: MatDialogRef<ChangeDateDialogComponent>,
    private deliveriesService: DeliveriesService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.currOrder = data.currOrder;
    this.dialogRef.disableClose = true;
    this.dateForm = this.formBuilder.group({
      idDetalle: this.currOrder.idDetalle,
      fecha: [
        formatDate(this.currOrder.fechaEntrega, 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      hora: [
        formatDate(
          this.currOrder.fechaEntrega,
          'HH:mm',
          'en'
        ),
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {}

  //GETTER PARA EL FORMULARIO
  get dForm() {
    return this.dateForm.controls;
  }

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
    if (this.dateForm.valid) {
      const deliveriesSubscription = this.deliveriesService
        .changeDDate(this.dateForm.value)
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
    } else if (this.dateForm.invalid) {
      let invalidFields = [].slice.call(
        document.getElementsByClassName('ng-invalid')
      );
      invalidFields[1].focus();
    }
  }
}
