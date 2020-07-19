import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-new-extra-charge-dialog',
  templateUrl: './new-extra-charge-dialog.component.html',
  styleUrls: ['./new-extra-charge-dialog.component.css']
})
export class NewExtraChargeDialogComponent implements OnInit {

  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  newECForm: FormGroup

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewExtraChargeDialogComponent>,
    private extraChargesService: ExtraChargesService
  ) {
  }

  ngOnInit(): void {
    this.initialize()
  }

  initialize(){
    this.newECForm = this.formBuilder.group({
      nombre:['', [Validators.required, Validators.maxLength(50)]],
      costo:[1.00, [Validators.required]]
    })
  }

  get f() {
    return this.newECForm.controls
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  onNewFormSubmit() {
    if (this.newECForm.valid) {
      this.loaders.loadingSubmit = true
      this.extraChargesService.createExtraCharge(this.newECForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
            })
          })
    }
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
