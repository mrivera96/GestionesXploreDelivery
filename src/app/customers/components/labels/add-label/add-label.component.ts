import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-add-label',
  templateUrl: './add-label.component.html',
  styleUrls: ['./add-label.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AddLabelComponent implements OnInit {
  succsMsg
  errorMsg
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  nLabelForm: FormGroup

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddLabelComponent>,
    private formBuilder: FormBuilder,
    private labelsService: LabelsService
  ) { }

  ngOnInit(): void {
    this.nLabelForm = this.formBuilder.group(
      {
        descEtiqueta: ['', [Validators.required, Validators.maxLength(100)]],
      }
    )
  }

  onSubmitForm() {
    if (this.nLabelForm.valid) {
      this.loaders.loadingSubmit = true
      const labelsSubscription = this.labelsService
        .createLabel(this.nLabelForm.value)
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
    return this.nLabelForm.controls
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
