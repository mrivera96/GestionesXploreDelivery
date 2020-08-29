import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ExtraCharge} from "../../../../models/extra-charge";
import {ExtraChargeOption} from "../../../../models/extra-charge-option";
import { ErrorModalComponent } from '../../error-modal/error-modal.component';
import { SuccessModalComponent } from '../../success-modal/success-modal.component';

@Component({
  selector: 'app-add-order-extracharge-dialog',
  templateUrl: './add-order-extracharge-dialog.component.html',
  styles: []
})
export class AddOrderExtrachargeDialogComponent implements OnInit {
  extraChargeForm: FormGroup
  extraCharges: ExtraCharge[] = []
  selectedExtraCharge: ExtraCharge = {}
  selectedExtraChargeOption: ExtraChargeOption = {}
  currentOrder: number
  loaders = {
    'loadingData': false,
    'loadingSubmit': false
  }

  constructor(
    public dialogRef: MatDialogRef<AddOrderExtrachargeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private extrachargeService: ExtraChargesService
  ) {
    this.currentOrder = this.data.order
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.extraChargeForm = this.formBuilder.group({
      idDetalle: [this.currentOrder, [Validators.required]],
      idCargoExtra: [null, [Validators.required]],
      idOpcionExtra: [null],
    })
  }

  loadData() {
    this.loaders.loadingData = true
    const extrachargeSubscription = this.extrachargeService.getExtraCharges().subscribe(response => {
      this.extraCharges = response.data
      this.loaders.loadingData = false
      extrachargeSubscription.unsubscribe()
    }, error => {
      extrachargeSubscription.unsubscribe()
    })
  }

  onFormSubmit(){
    if(this.extraChargeForm.valid){
      this.loaders.loadingSubmit = true
      const ecSubscription = this.deliveriesService.addExtraChargeToOrder(this.extraChargeForm.value).subscribe(response => {
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        this.loaders.loadingSubmit = false
        ecSubscription.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.openErrorDialog(error.statusText)
          this.loaders.loadingSubmit = false
          ecSubscription.unsubscribe()
        })

      })
    }
  }

  setSelectedExtraCharge(extraCharge) {
    this.selectedExtraCharge = extraCharge
    if(this.selectedExtraCharge.options.length > 0){
      this.extraChargeForm.controls.idOpcionExtra.setValidators([Validators.required])
    }
  }

  setSelectedExtraChargeOption(option) {
    this.selectedExtraChargeOption = option
  }

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
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
      location.reload(true)
    })
  }


}
