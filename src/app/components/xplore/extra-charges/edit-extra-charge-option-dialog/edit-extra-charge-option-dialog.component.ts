import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ExtraChargeOption} from "../../../../models/extra-charge-option";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-edit-extra-charge-option-dialog',
  templateUrl: './edit-extra-charge-option-dialog.component.html',
  styleUrls: ['./edit-extra-charge-option-dialog.component.css']
})
export class EditExtraChargeOptionDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  exChrgOptForm: FormGroup
  currOption: ExtraChargeOption = {}
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private extraChargesServices: ExtraChargesService,
  ) {
    this.currOption = this.data.option
  }

  ngOnInit(): void {
    this.initialize()
  }

  initialize() {
    this.exChrgOptForm = this.formBuilder.group({
      costo:[this.currOption.costo,[Validators.required, Validators.min(0.1)]],
      tiempo:[this.currOption.tiempo,[Validators.required, Validators.min(1)]]
    })
  }

  onFormSubmit() {
    if (this.exChrgOptForm.valid) {
      this.loaders.loadingSubmit = true
      const extraChargesSubscription = this.extraChargesServices.editExtraChargeOption(this.currOption.idCargoExtra,this.currOption.idDetalleOpcion, this.exChrgOptForm.value)
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
