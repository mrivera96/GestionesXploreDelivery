import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../../../services/categories.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { ServiceTypeService } from '../../../../services/service-type.service';
import { ServiceType } from '../../../../models/service-type';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.css'],
})
export class NewCategoryDialogComponent implements OnInit {
  newCatForm: FormGroup;
  loaders = {
    loadingSubmit: false,
  };
  serviceTypes: ServiceType[];

  constructor(
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public dialog: MatDialog,
    private servTypesService: ServiceTypeService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize() {
    this.newCatForm = new FormGroup({
      descCategoria: new FormControl('', [
        Validators.required,
        Validators.maxLength(60),
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(250),
      ]),
      idTipoServicio: new FormControl(null),
    });
  }

  loadData() {
    const servTypeSubs = this.servTypesService
      .getServiceTypes()
      .subscribe((response) => {
        this.serviceTypes = response.data;
        servTypeSubs.unsubscribe();
      });
  }

  get fNew() {
    return this.newCatForm.controls;
  }

  onFormNewSubmit() {
    if (this.newCatForm.valid) {
      this.loaders.loadingSubmit = true;
      const categoriesSubscription = this.categoriesService
        .createCategory(this.newCatForm.value)
        .subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            categoriesSubscription.unsubscribe();
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
              categoriesSubscription.unsubscribe();
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
