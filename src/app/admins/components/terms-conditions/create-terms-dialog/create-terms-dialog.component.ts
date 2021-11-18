import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';
import { TermConditionsService } from '../../../../services/term-conditions.service';

@Component({
  selector: 'app-create-terms-dialog',
  templateUrl: './create-terms-dialog.component.html',
  styleUrls: ['./create-terms-dialog.component.css'],
})
export class CreateTermsDialogComponent implements OnInit {
  newParagraphForm: FormGroup;
  loaders = {
    loadingSubmit: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private termsConditionsService: TermConditionsService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.newParagraphForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      valor: ['', Validators.required],
      negrita: [false],
      cursiva: [false],
    });
  }

  get f() {
    return this.newParagraphForm.controls;
  }

  onFormSubmit() {
    if (this.newParagraphForm.valid) {
      this.loaders.loadingSubmit = true;
      const termsSubsc = this.termsConditionsService
        .create(this.newParagraphForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            termsSubsc.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
              termsSubsc.unsubscribe();
            });
          }
        );
    }
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef.close(true);
    });
  }
}
