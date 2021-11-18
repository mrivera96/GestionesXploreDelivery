import {Component, Inject, OnInit} from '@angular/core';
import {ExtraChargeOption} from "../../../../models/extra-charge-option";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";

@Component({
  selector: 'app-add-extra-charge-option-dailog',
  templateUrl: './add-extra-charge-option-dialog.component.html',
  styleUrls: ['./add-extra-charge-option-dialog.component.css']
})
export class AddExtraChargeOptionDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  extraChargeId: number
  extrachargeOptions: ExtraChargeOption[]
  exChrgOptForm: FormGroup
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private extraChargesServices: ExtraChargesService,
  ) {
    this.extraChargeId = this.data.extraChargeId
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
  }

  initialize() {
    this.exChrgOptForm = this.formBuilder.group({
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      costo:[1,[Validators.required, Validators.min(0.1)]],
      tiempo:[1,[Validators.required, Validators.min(1)]]
    })
  }

  onFormSubmit() {
    if (this.exChrgOptForm.valid) {
      this.loaders.loadingSubmit = true
      const extraChargesSubscription = this.extraChargesServices.addOptionToExtraCharge(this.extraChargeId, this.exChrgOptForm.value)
        .subscribe(response => {
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          this.loaders.loadingSubmit = false
          extraChargesSubscription.unsubscribe()

        }, error => {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
            this.loaders.loadingSubmit = false
            extraChargesSubscription.unsubscribe()
          })
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
