import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Restriction} from "../../../../models/restriction";
<<<<<<< HEAD:src/app/admins/components/restrictions/edit-restriction-dialog/edit-restriction-dialog.component.ts
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";
=======
import {ErrorModalComponent} from "../../../../shared/components/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../shared/components/success-modal/success-modal.component";
>>>>>>> origin/V5:src/app/admins/components/restrictions/edit-restriction-dialog/edit-restriction-dialog.component.ts
import {RestrictionsService} from "../../../../services/restrictions.service";

@Component({
  selector: 'app-edit-restriction-dialog',
  templateUrl: './edit-restriction-dialog.component.html',
  styleUrls: ['./edit-restriction-dialog.component.css']
})
export class EditRestrictionDialogComponent implements OnInit {
  edRestriction: FormGroup
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  currRestriction: Restriction

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private restrictionService: RestrictionsService
  ) {
    this.currRestriction = data.restriction
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.edRestriction = this.formBuilder.group({
      idRestriccion: [this.currRestriction.idRestriccion],
      descripcion: [this.currRestriction.descripcion],
      valMinimo: [this.currRestriction.valMinimo],
      valMaximo: [this.currRestriction.valMaximo]
    })
  }

  get f() {
    return this.edRestriction.controls;
  }

  onFormSubmit() {
    if (this.edRestriction.valid) {
      this.loaders.loadingSubmit = true
      const restSubsc = this.restrictionService.updateRestriction(this.edRestriction.value)
        .subscribe(response => {
          this.loaders.loadingSubmit = false
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          restSubsc.unsubscribe()
        }, error => {
          error.subscribe(error => {
            this.loaders.loadingSubmit = false
            this.openErrorDialog(error.statusText)
            restSubsc.unsubscribe()
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
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogRef.close(true)
    })
  }

}
