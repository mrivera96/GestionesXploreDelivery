import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ExtraCharge} from "../../../../models/extra-charge";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-edit-extra-charge-dialog',
  templateUrl: './edit-extra-charge-dialog.component.html',
  styleUrls: ['./edit-extra-charge-dialog.component.css']
})
export class EditExtraChargeDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  editECForm: FormGroup
  currEc: ExtraCharge
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditExtraChargeDialogComponent>,
    private extraChargesService: ExtraChargesService
  ) {
    this.currEc = this.data.extraCharge
  }

  ngOnInit(): void {
    this.initialize()
  }

  initialize(){
    this.editECForm = this.formBuilder.group({
      nombre:[this.currEc.nombre, [Validators.required, Validators.maxLength(50)]],
      costo:[this.currEc.costo, [Validators.required]],
      tipoCargo:[this.currEc.tipoCargo,[Validators.required]],
    })
  }

  get f() {
    return this.editECForm.controls
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  onFormEditSubmit() {
    if (this.editECForm.valid) {
      this.loaders.loadingSubmit = true
      this.extraChargesService.editExtraCharge(this.currEc.idCargoExtra, this.editECForm.value)
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
