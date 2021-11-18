import { Component, OnInit, Inject } from '@angular/core';
import { ExtraChargeCategory } from 'src/app/models/extra-charge-category';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ExtraChargesService } from 'src/app/services/extra-charges.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { AddCategoryExtraChargeDailogComponent } from './add-category-extra-charge-dailog/add-category-extra-charge-dailog.component';

@Component({
  selector: 'app-extra-charge-categories',
  templateUrl: './extra-charge-categories.component.html',
  styleUrls: ['./extra-charge-categories.component.css'],
})
export class ExtraChargeCategoriesComponent implements OnInit {
  loaders = {
    loadingData: false,
  };

  extraChargeCategories: ExtraChargeCategory[];

  extraChargeId: number;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private extraChargesService: ExtraChargesService
  ) {
    this.extraChargeId = this.data.extraChargeId;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loaders.loadingData = true;
    const extraChargesSubscription = this.extraChargesService
      .getExtraChargeCategories(this.extraChargeId)
      .subscribe((response) => {
        this.extraChargeCategories = response.data;
        this.loaders.loadingData = false;
        extraChargesSubscription.unsubscribe();
      });
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
      this.loadData();
    });
  }

  removeCategoryFromExtraCharge(category) {
    this.loaders.loadingData = true;
    const extraChargesSubscription = this.extraChargesService
      .removeCategoryFromExtraCharge(this.extraChargeId, category)
      .subscribe(
        (response) => {
          this.openSuccessDialog(
            'Operación Realizada Correctamente',
            response.message
          );
          this.loaders.loadingData = false;
          extraChargesSubscription.unsubscribe();
        },
        (error) => {
          error.subscribe((error) => {
            this.loaders.loadingData = false;
            this.openErrorDialog(error.statusText);
            extraChargesSubscription.unsubscribe();
          });
        }
      );
  }

  showAddDialog() {
    const dialogRef = this.dialog.open(AddCategoryExtraChargeDailogComponent, {
      data: {
        extraChargeId: this.extraChargeId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
}
