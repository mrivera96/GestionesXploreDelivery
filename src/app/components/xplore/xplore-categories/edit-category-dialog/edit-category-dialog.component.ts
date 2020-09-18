import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../../services/categories.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {Category} from "../../../../models/category";

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {
  currCategory: Category
  edCatForm: FormGroup
  loaders = {
    loadingSubmit: false
  }
  constructor(
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.currCategory = this.data.category
  }

  ngOnInit(): void {
    this.edCatForm = new FormGroup(
      {
        idCategoria: new FormControl(this.currCategory.idCategoria),
        descCategoria: new FormControl(this.currCategory.descCategoria, [Validators.required, Validators.maxLength(60)]),
        descripcion: new FormControl(this.currCategory.descripcion,[Validators.required, Validators.maxLength(250)]),
        isActivo: new FormControl(this.currCategory.isActivo, Validators.required)
      }
    )

  }

  get f() {
    return this.edCatForm.controls
  }

  onFormEditSubmit() {
    if (this.edCatForm.valid) {
      this.loaders.loadingSubmit = true
      const categoriesSubscription = this.categoriesService.editCategory(this.edCatForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente', response.message)
            categoriesSubscription.unsubscribe()
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
              categoriesSubscription.unsubscribe()
            })
          })
    }
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

  changeActive(checked){
    if(checked){
      this.f.isActivo.setValue(true)
    }else{
      this.f.isActivo.setValue(false)
    }
  }

}
