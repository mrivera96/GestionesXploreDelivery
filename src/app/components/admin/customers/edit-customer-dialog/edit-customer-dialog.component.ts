import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Customer } from "../../../../models/customer";
import { ErrorModalComponent } from "../../../shared/error-modal/error-modal.component";
import { SuccessModalComponent } from "../../../shared/success-modal/success-modal.component";
import { UsersService } from "../../../../services/users.service";
import { BillingFrequenciesService } from "../../../../services/billing-frequencies.service";

@Component({
  selector: 'app-edit-customer-dialog',
  templateUrl: './edit-customer-dialog.component.html',
  styleUrls: ['./edit-customer-dialog.component.css']
})
export class EditCustomerDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  edCustForm: FormGroup
  currCustomer: Customer
  billingFrequencies: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditCustomerDialogComponent>,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private billingFrecuenciesService: BillingFrequenciesService
  ) {
    this.currCustomer = data.customer
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.loadData()
    this.edCustForm = this.formBuilder.group({
      idCliente: [this.currCustomer.idCliente],
      nomEmpresa: [this.currCustomer.nomEmpresa, [
        Validators.required,
        Validators.maxLength(80)]],
      nomRepresentante: [this.currCustomer.nomRepresentante, [
        Validators.required,
        Validators.maxLength(80)]],
      numIdentificacion: [this.currCustomer.numIdentificacion, [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(13)]],
      numTelefono: [this.currCustomer.numTelefono, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)]],
      montoGracia: [this.currCustomer.montoGracia, [
        Validators.required,
        Validators.minLength(1),
      ]],
      idFrecuenciaFact: [this.currCustomer.idFrecuenciaFact],
      rtn: [this.currCustomer.rtn, [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(14)]],
      razonSocial: [this.currCustomer.razonSocial, [
        Validators.required,
        Validators.maxLength(80)]],
      email: [this.currCustomer.email, [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.maxLength(50)]],
      correosFact: [this.currCustomer.correosFact, [Validators.required,
        Validators.maxLength(200)]],
      enviarNotificaciones: [+this.currCustomer.enviarNotificaciones, Validators.required]
    })
  }

  loadData() {
    const bfSubs = this.billingFrecuenciesService.getBillingFrequencies()
      .subscribe(response => {
        this.billingFrequencies = response.data
        bfSubs.unsubscribe()
      })
  }

  get f() {
    return this.edCustForm.controls
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

  onEditFormSubmit() {
    if (this.edCustForm.valid) {
      this.loaders.loadingSubmit = true
      this.usersService.editCustomer(this.edCustForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.openErrorDialog(error.statusText)
        })
      })
    }
  }

}
