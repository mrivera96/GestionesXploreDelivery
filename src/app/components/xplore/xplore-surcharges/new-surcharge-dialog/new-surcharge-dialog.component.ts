import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {UsersService} from "../../../../services/users.service";
import {SurchargesService} from "../../../../services/surcharges.service";
import {Customer} from "../../../../models/customer";

@Component({
  selector: 'app-new-surcharge-dialog',
  templateUrl: './new-surcharge-dialog.component.html',
  styleUrls: ['./new-surcharge-dialog.component.css']
})
export class NewSurchargeDialogComponent implements OnInit {
  newSurchForm: FormGroup
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  customers: Customer[]
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private usersService: UsersService,
    private surchargesService: SurchargesService,
  ) { }

  ngOnInit(): void {

    this.newSurchForm = this.formBuilder.group(
      {
        descRecargo:['', Validators.required],
        kilomMinimo: ['', Validators.required],
        kilomMaximo: ['', Validators.required],
        monto: ['', Validators.required],
        idCliente: [null, Validators.required]
      }
    )

    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
    })
  }
  get fNew() {
    return this.newSurchForm.controls
  }

  onFormNewSubmit() {
    if (this.newSurchForm.valid) {
      this.loaders.loadingSubmit = true
      this.surchargesService.createSurcharge(this.newSurchForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente',response.message)
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
      location.reload(true)
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
