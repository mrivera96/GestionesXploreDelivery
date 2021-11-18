import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TermConditionsService } from '../../../../services/term-conditions.service';
import { TermCondition } from '../../../../models/term-condition';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-edit-terms-dialog',
  templateUrl: './edit-terms-dialog.component.html',
  styleUrls: ['./edit-terms-dialog.component.css'],
})
export class EditTermsDialogComponent implements OnInit {
  loaders = {
    loadingSubmit: false,
  };
  edParagraphForm: FormGroup;
  currentParagraph: TermCondition;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private termsConditionsService: TermConditionsService
  ) {
    this.dialogRef.disableClose = true;
    this.currentParagraph = this.data.termCondition;
  }

  ngOnInit(): void {
    this.edParagraphForm = this.formBuilder.group({
      id: [this.currentParagraph.id],
      descripcion: [this.currentParagraph.descripcion, Validators.required],
      valor: [this.currentParagraph.valor, Validators.required],
      negrita: [+this.currentParagraph.negrita],
      cursiva: [+this.currentParagraph.cursiva],
    });
  }

  get f() {
    return this.edParagraphForm.controls;
  }

  onFormSubmit() {
    if (this.edParagraphForm.valid) {
      this.loaders.loadingSubmit = true;
      const termsSubsc = this.termsConditionsService
        .update(this.edParagraphForm.value)
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
