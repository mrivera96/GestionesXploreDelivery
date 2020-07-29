import { Component, OnInit, Inject } from '@angular/core';
import { Category } from 'src/app/models/category';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExtraChargesService } from 'src/app/services/extra-charges.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoriesService } from 'src/app/services/categories.service';
import { ErrorModalComponent } from 'src/app/components/shared/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/components/shared/success-modal/success-modal.component';

@Component({
  selector: 'app-add-category-extra-charge-dailog',
  templateUrl: './add-category-extra-charge-dailog.component.html',
  styleUrls: ['./add-category-extra-charge-dailog.component.css']
})
export class AddCategoryExtraChargeDailogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  extraChargeId: number
  categories: Category[]
  catForm: FormGroup
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private extraChargesServices: ExtraChargesService,
    private categoriesService: CategoriesService
  ) {
    this.extraChargeId = this.data.extraChargeId
   }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.catForm = this.formBuilder.group({
      idCategoria: [null, [Validators.required]]
    })
  }

  loadData() {
    this.loaders.loadingData = true
    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
      this.loaders.loadingData = false
    })

  }

  onFormSubmit() {
    if (this.catForm.valid) {
      this.loaders.loadingSubmit = true
      this.extraChargesServices.addCategoryToExtraCharge(this.extraChargeId, this.catForm.get('idCategoria').value)
        .subscribe(response => {
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          this.loaders.loadingSubmit = false

        }, error => {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
            this.loaders.loadingSubmit = false
          })
        })
    }
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
      this.dialogRef.close(true)
    })
  }


}
