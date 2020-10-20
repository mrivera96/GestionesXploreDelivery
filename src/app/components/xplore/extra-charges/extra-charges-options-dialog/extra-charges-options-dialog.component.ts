import {Component, Inject, OnInit} from '@angular/core';
import {ExtraChargeOption} from "../../../../models/extra-charge-option";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {AddExtraChargeOptionDialogComponent} from "../add-extra-charge-option-dialog/add-extra-charge-option-dialog.component";
import {EditExtraChargeOptionDialogComponent} from "../edit-extra-charge-option-dialog/edit-extra-charge-option-dialog.component";

@Component({
  selector: 'app-extra-charges-options-dialog',
  templateUrl: './extra-charges-options-dialog.component.html',
  styleUrls: ['./extra-charges-options-dialog.component.css']
})
export class ExtraChargesOptionsDialogComponent implements OnInit {
  loaders = {
    loadingData: false
  }

  extraChargeOptions: ExtraChargeOption[]
  extraChargeId: number

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private extraChargesService: ExtraChargesService
  ) {
    this.extraChargeId = this.data.extraChargeId
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true
    const extraChargesSubscription = this.extraChargesService.getExtraChargeOptions(this.extraChargeId)
      .subscribe(response => {
        this.extraChargeOptions = response.data
        this.loaders.loadingData = false
        extraChargesSubscription.unsubscribe()
      })
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
    })

    dialogRef.afterClosed().subscribe(result => {
      this.loadData()
    })
  }

  removeOptionFromExtraCharge(option) {
    this.loaders.loadingData = true
    const extraChargesSubscription = this.extraChargesService.removeOptionFromExtraCharge(this.extraChargeId, option).subscribe(response => {
      this.openSuccessDialog('Operación Realizada Correctamente', response.message)
      this.loaders.loadingData = false
      extraChargesSubscription.unsubscribe()
    }, error => {
      error.subscribe(error => {
        this.loaders.loadingData = false
        this.openErrorDialog(error.statusText)
        extraChargesSubscription.unsubscribe()
      })
    })
  }

  showAddDialog() {
    const dialogRef = this.dialog.open(AddExtraChargeOptionDialogComponent, {
      data: {
        extraChargeId: this.extraChargeId,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData()
      }

    })
  }

  editExtraChargeOption(option){
    const dialogRef = this.dialog.open(EditExtraChargeOptionDialogComponent, {
      data: {
        option: option,
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData()
      }

    })
  }

}
