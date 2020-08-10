import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ExtraChargesService} from "../../../../services/extra-charges.service";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-extra-charge-dialog',
  templateUrl: './new-extra-charge-dialog.component.html',
  styleUrls: ['./new-extra-charge-dialog.component.css']
})
export class NewExtraChargeDialogComponent implements OnInit {

  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  newECForm: FormGroup
  categories: Category[]
  extraChargeCategories: Category[] = []
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewExtraChargeDialogComponent>,
    private categoriesService: CategoriesService,
    private extraChargesService: ExtraChargesService
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  loadData(){
    this.loaders.loadingData = true
    const categoriesSubscription =  this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
      this.loaders.loadingData = false
      categoriesSubscription.unsubscribe()
    })
  }

  initialize(){
    this.newECForm = this.formBuilder.group({
      nombre:['', [Validators.required, Validators.maxLength(50)]],
      costo:[1.00, [Validators.required]],
      tipoCargo:['',[Validators.required]],
      idCategoria:[null, Validators.required]
    })
  }

  get f() {
    return this.newECForm.controls
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  onNewFormSubmit() {
    if (this.newECForm.valid) {
      this.loaders.loadingSubmit = true
      const extrachargesSubscription = this.extraChargesService.createExtraCharge(this.newECForm.value, this.extraChargeCategories)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente', response.message)
            extrachargesSubscription.unsubscribe()
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
              extrachargesSubscription.unsubscribe()
            })
          })
    }
  }

  addCategoryToExtraCharge(idCat){
    let categoryToAdd: Category = {}
    this.categories.forEach(value => {
      if(value.idCategoria == idCat){
        categoryToAdd = value
      }
    })

    if(!this.extraChargeCategories.includes(categoryToAdd)){
      this.extraChargeCategories.push(categoryToAdd)
    }
  }

  removeFromArray(item) {
    let i = this.extraChargeCategories.indexOf(item)
    this.extraChargeCategories.splice(i, 1)
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
