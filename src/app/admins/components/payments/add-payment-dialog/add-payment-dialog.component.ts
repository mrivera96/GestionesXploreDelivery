import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Customer} from "../../../../models/customer";
import {PaymentType} from "../../../../models/payment-type";
import {formatDate} from "@angular/common";
import {UsersService} from "../../../../services/users.service";
import {PaymentsService} from "../../../../services/payments.service";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";
import {Bank} from "../../../../models/bank";
import { PaymentDateValidator } from 'src/app/helpers/paymentDate.validator';

@Component({
  selector: 'app-add-payment-dialog',
  templateUrl: './add-payment-dialog.component.html',
  styleUrls: ['./add-payment-dialog.component.css']
})
export class AddPaymentDialogComponent implements OnInit {
  nPayForm: FormGroup
  customers: Customer[]
  paymentTipes: PaymentType[]
  loaders = {
    'loadingSubmit': false
  }

  filteredCustomers: Customer[]

  banks: Bank[]
  constructor(
    public dialogRef: MatDialogRef<AddPaymentDialogComponent>,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private paymentsService: PaymentsService,
    public dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize(){

    this.banks = [
      {descBanco: 'BAC', numCuenta:'730226831'},
      {descBanco: 'FICOHSA', numCuenta:'0-0-200007101178'}
    ]
    this.nPayForm = this.formBuilder.group({
      fechaPago:[formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      monto:[1.00, [Validators.required, Validators.maxLength(20)]],
      tipoPago:[null, [Validators.required]],
      idCliente:[null, [Validators.required]],
      numAutorizacion:['',[Validators.minLength(6), Validators.maxLength(6)]],
      referencia:['',[Validators.maxLength(12)]],
      banco:['']
    }, {
      validators:[
        PaymentDateValidator('fechaPago')
      ]
    })
  }

  get f(){
    return this.nPayForm.controls
  }
  loadData(){

    const usersSubscription = this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
      this.filteredCustomers = response.data
      usersSubscription.unsubscribe()
    })

    const paymentTypeSubscription = this.paymentsService.getPaymentTypes().subscribe( response => {
      this.paymentTipes = response.data
      paymentTypeSubscription.unsubscribe()
    })

  }

  changeValidators(tipoPago){
    if(tipoPago == 6){
      this.f.numAutorizacion.setValidators([Validators.required])
      this.f.referencia.setValidators(null)
      this.f.banco.setValidators(null)
      this.f.referencia.setErrors(null)
      this.f.banco.setErrors(null)

    }else if(tipoPago == 7){
      this.f.referencia.setValidators([Validators.required])
      this.f.banco.setValidators([Validators.required])
      this.f.numAutorizacion.setValidators(null)
      this.f.numAutorizacion.setErrors(null)
    }else{
      this.f.referencia.setValidators(null)
      this.f.banco.setValidators(null)
      this.f.numAutorizacion.setValidators(null)
      this.f.referencia.setErrors(null)
      this.f.banco.setErrors(null)
      this.f.numAutorizacion.setErrors(null)

    }
  }

  onNewFormSubmit(){

    if(this.nPayForm.valid){
      this.loaders.loadingSubmit = true
      const paymentsSubscription = this.paymentsService.addPayment(this.nPayForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        paymentsSubscription.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.openErrorDialog(error.statusText)
          paymentsSubscription.unsubscribe()
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

  onKey(value) {
    this.filteredCustomers = this.search(value) ;
  }

  search(value: string) {
    let filter = value.toLowerCase();
    filter = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (filter != "") {
      return this.customers.filter(option => option.nomEmpresa.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter));
    }
    return this.customers
  }

}
