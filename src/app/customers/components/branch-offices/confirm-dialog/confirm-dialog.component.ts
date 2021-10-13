import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BranchService} from "../../../../services/branch.service";
import {SuccessModalComponent} from "../../../../shared/components/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../../shared/components/error-modal/error-modal.component";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {
  branchToDelete: number
  loaders = {
    'loadingSubmit': false
  }

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private branchService: BranchService,
  ) {
    this.branchToDelete = data.branchToDelete
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  //COMUNICACIÓN CON LA API PARA ELIMINAR EL REGISTRO
  deleteBranch() {
    const branchesSubscription = this.branchService.deleteBranch(this.branchToDelete).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        branchesSubscription.unsubscribe()
      },
      error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.openErrorDialog(error.statusText)
          branchesSubscription.unsubscribe()
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
