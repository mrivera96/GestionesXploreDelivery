import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/components/shared/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/components/shared/success-modal/success-modal.component';
import { Label } from 'src/app/models/label';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-edit-label',
  templateUrl: './edit-label.component.html',
  styleUrls: ['./edit-label.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class EditLabelComponent implements OnInit {

  succsMsg
  errorMsg
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  edtLabelForm: FormGroup
  currentLabel: Label = {}
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditLabelComponent>,
    private formBuilder: FormBuilder,
    private labelsService: LabelsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.currentLabel = this.data.label
   }

  ngOnInit(): void {
    this.edtLabelForm = this.formBuilder.group(
      {
        idEtiqueta: [this.currentLabel.idEtiqueta],
        descEtiqueta: [this.currentLabel.descEtiqueta, [Validators.required, Validators.maxLength(100)]],
      }
    )
  }

  onSubmitForm() {
    if (this.edtLabelForm.valid) {
      this.loaders.loadingSubmit = true
      const labelsSubscription = this.labelsService
        .updateLabel(this.edtLabelForm.value)
        .subscribe(response => {
          this.loaders.loadingSubmit = false
          this.succsMsg = response.message
          this.openSuccessDialog('Operación Realizada Correctamente', this.succsMsg)
          labelsSubscription.unsubscribe()
        }, error => {
          error.subscribe(error => {
            this.loaders.loadingSubmit = false
            this.errorMsg = error.statusText
            this.openErrorDialog(this.errorMsg)
            labelsSubscription.unsubscribe()
          })
        })
    }
  }

  get f() {
    return this.edtLabelForm.controls
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

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

}
