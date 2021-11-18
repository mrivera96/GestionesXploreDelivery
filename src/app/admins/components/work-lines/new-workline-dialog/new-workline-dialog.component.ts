import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { WorkLinesService } from 'src/app/services/work-lines.service';

@Component({
  selector: 'app-new-workline-dialog',
  templateUrl: './new-workline-dialog.component.html',
  styles: [],
})
export class NewWorklineDialogComponent implements OnInit {
  newWLForm: FormGroup;

  loaders = {
    loadingSubmit: false,
  };
  constructor(
    private worklinesService: WorkLinesService,
    public dialogRef: MatDialogRef<NewWorklineDialogComponent>,
    public dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.newWLForm = new FormGroup({
      nomRubro: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      descRubro: new FormControl('', [
        Validators.required,
        Validators.maxLength(250),
      ]),
    });
  }

  get fNew() {
    return this.newWLForm.controls;
  }

  onFormNewSubmit() {
    if (this.newWLForm.valid) {
      this.loaders.loadingSubmit = true;
      const worklinesSubscription = this.worklinesService
        .createWorkLine(this.newWLForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            worklinesSubscription.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
              worklinesSubscription.unsubscribe();
            });
          }
        );
    }
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

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }
}
