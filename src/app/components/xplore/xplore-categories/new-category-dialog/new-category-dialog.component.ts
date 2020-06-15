import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../../services/categories.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.css']
})
export class NewCategoryDialogComponent implements OnInit {
  newCatForm: FormGroup
  loaders = {
    loadingSubmit: false
  }
  constructor(
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.newCatForm = new FormGroup(
      {
        descCategoria: new FormControl('', Validators.required)
      }
    )
  }

  get fNew(){
    return this.newCatForm.controls
  }

  onFormNewSubmit() {
    if (this.newCatForm.valid) {
      this.loaders.loadingSubmit = true
      this.categoriesService.createCategory(this.newCatForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
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

}
