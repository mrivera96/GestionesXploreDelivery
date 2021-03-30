import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/components/shared/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/components/shared/success-modal/success-modal.component';
import { LabelsService } from 'src/app/services/labels.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.css']
})
export class ConfirmDeleteComponent implements OnInit {

  labelToDelete: number
  loaders = {
    'loadingSubmit': false
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private labelsService: LabelsService,
  ) {
    this.labelToDelete = data.labelToDelete
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  deleteLabel() {
    const labelsSubscription = this.labelsService.deleteLabel(this.labelToDelete)
      .subscribe(response => {
        this.loaders.loadingSubmit = false
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        labelsSubscription.unsubscribe()
      },
        error => {
          error.subscribe(error => {
            this.loaders.loadingSubmit = false
            this.openErrorDialog(error.statusText)
            labelsSubscription.unsubscribe()
          })

        })
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
