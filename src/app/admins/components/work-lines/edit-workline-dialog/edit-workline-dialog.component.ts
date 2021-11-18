import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { WorkLine } from 'src/app/models/work-line';
import { WorkLinesService } from 'src/app/services/work-lines.service';

@Component({
  selector: 'app-edit-workline-dialog',
  templateUrl: './edit-workline-dialog.component.html',
  styles: [],
})
export class EditWorklineDialogComponent implements OnInit {
  currWorkLine: WorkLine = {};
  edWLForm: FormGroup;
  loaders = {
    loadingSubmit: false,
  };

  constructor(
    private workLineService: WorkLinesService,
    public dialogRef: MatDialogRef<EditWorklineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.currWorkLine = this.data.workline;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.edWLForm = new FormGroup({
      idRubro: new FormControl(this.currWorkLine.idRubro),
      nomRubro: new FormControl(this.currWorkLine.nomRubro, [
        Validators.required,
        Validators.maxLength(60),
      ]),
      descRubro: new FormControl(this.currWorkLine.descRubro, [
        Validators.required,
        Validators.maxLength(250),
      ]),
      isActivo: new FormControl(
        this.currWorkLine.isActivo,
        Validators.required
      ),
    });
  }

  get f() {
    return this.edWLForm.controls;
  }

  onFormEditSubmit() {
    if (this.edWLForm.valid) {
      this.loaders.loadingSubmit = true;
      const workLinesSubscription = this.workLineService
        .editWorkLine(this.edWLForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            workLinesSubscription.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
              workLinesSubscription.unsubscribe();
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

  changeActive(checked) {
    if (checked) {
      this.f.isActivo.setValue(true);
    } else {
      this.f.isActivo.setValue(false);
    }
  }
}
