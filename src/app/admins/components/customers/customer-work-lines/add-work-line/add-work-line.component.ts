import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { UsersService } from '../../../../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkLinesService } from '../../../../../services/work-lines.service';
import { WorkLine } from '../../../../../models/work-line';
import { ErrorModalComponent } from '../../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-add-work-line',
  templateUrl: './add-work-line.component.html',
  styles: [],
})
export class AddWorkLineComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };

  workLines: WorkLine[] = [];
  wlForm: FormGroup;
  currentCustomer: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private usersService: UsersService,
    private workLinesService: WorkLinesService,
    private formBuilder: FormBuilder
  ) {
    this.currentCustomer = this.data.customerId;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize() {
    this.wlForm = this.formBuilder.group({
      idRubro: [null, [Validators.required]],
    });
  }

  loadData() {
    this.loaders.loadingData = true;
    const wLSubscription = this.workLinesService.getWorkLines().subscribe(
      (response) => {
        this.workLines = response.data;
        this.loaders.loadingData = false;
        wLSubscription.unsubscribe();
      },
      (error) => {
        error.subscribe((error) => {
          this.openErrorDialog(error.statusText);
          this.loaders.loadingData = false;
        });
      }
    );
  }

  onFormSubmit() {
    if (this.wlForm.valid) {
      this.loaders.loadingSubmit = true;
      const wlsubscription = this.workLinesService
        .addCustomerToWorkLine(
          this.currentCustomer,
          this.wlForm.get('idRubro').value
        )
        .subscribe(
          (response) => {
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            this.loaders.loadingSubmit = false;
            wlsubscription.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.openErrorDialog(error.statusText);
              this.loaders.loadingSubmit = false;
              wlsubscription.unsubscribe();
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
