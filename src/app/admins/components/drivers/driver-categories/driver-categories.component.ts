import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { DriverCategories } from 'src/app/models/driver-categories';
import { UsersService } from 'src/app/services/users.service';
import { AddCategoryComponent } from '../add-category/add-category.component';

@Component({
  selector: 'app-driver-categories',
  templateUrl: './driver-categories.component.html',
  styleUrls: ['./driver-categories.component.css'],
})
export class DriverCategoriesComponent implements OnInit {
  currentDriver: number = 0;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  driverCategories: DriverCategories;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DriverCategoriesComponent>,
    private usersService: UsersService
  ) {
    this.currentDriver = this.data.driver;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loaders.loadingData = true;
    const usersSubscription = this.usersService
      .getDriverCategories(this.currentDriver)
      .subscribe((response) => {
        this.driverCategories = response.data;
        this.loaders.loadingData = false;
        usersSubscription.unsubscribe();
      });
  }

  showAddDialog() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: {
        driverId: this.currentDriver,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  removeDriverCategory(category) {
    this.loaders.loadingData = true;
    const usrsSubs = this.usersService
      .removeDriverCategory(this.currentDriver, category)
      .subscribe(
        (response) => {
          this.openSuccessDialog(
            'Operación Realizada Correctamente',
            response.message
          );
          this.loaders.loadingSubmit = false;
          usrsSubs.unsubscribe();
        },
        (error) => {
          error.subscribe((error) => {
            this.openErrorDialog(error.statusText);
            this.loaders.loadingSubmit = false;
            usrsSubs.unsubscribe();
          });
        }
      );
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
