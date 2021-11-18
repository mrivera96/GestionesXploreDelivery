import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/components/shared/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/components/shared/success-modal/success-modal.component';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  categories: Category [] = []
  catForm: FormGroup
  currentDriver: number = 0
  constructor(
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddCategoryComponent>
  ) {
    this.currentDriver = this.data.driverId
   }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize(){
    this.catForm = this.formBuilder.group({
      idCategoria: [null, [Validators.required]]
    })
  }

  loadData(){
    this.loaders.loadingData = true
    const catSubs = this.categoriesService
    .getAllCategories()
    .subscribe(response => {
      this.loaders.loadingData = false
      this.categories = response.data
      catSubs.unsubscribe()
    }, error => {
      error.subscribe(error => {
        this.openErrorDialog(error.statusText)
        this.loaders.loadingData = false
      })
    })
  }

  onFormSubmit(){
    if (this.catForm.valid) {
      console.log(this.catForm.get('idCategoria').value)
      this.loaders.loadingSubmit = true
      const catSubscription = this.usersService
      .assignDriverCategory(this.currentDriver, this.catForm.get('idCategoria').value)
        .subscribe(response => {
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          this.loaders.loadingSubmit = false
          catSubscription.unsubscribe()
        }, error => {
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
            this.loaders.loadingSubmit = false
            catSubscription.unsubscribe()
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
