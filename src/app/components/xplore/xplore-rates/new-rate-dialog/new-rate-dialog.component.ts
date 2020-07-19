import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {RatesService} from "../../../../services/rates.service";
import {CategoriesService} from "../../../../services/categories.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../../services/users.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../../../models/category";
import {Customer} from "../../../../models/customer";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {Subject} from "rxjs";

@Component({
  selector: 'app-new-rate-dialog',
  templateUrl: './new-rate-dialog.component.html',
  styleUrls: ['./new-rate-dialog.component.css']
})
export class NewRateDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  dtTrigger: Subject<any> = new Subject()
  dtOptions: any
  newRateForm: FormGroup
  categories: Category[]
  customers: Customer[]
  rateCustomers: Customer[] = []
  filteredCustomers: Customer[]
  isGeneral: boolean = false
  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void {
    this.newRateForm = this.formBuilder.group(
      {
        descTarifa: ['', Validators.required],
        idCategoria: [null, Validators.required],
        entregasMinimas: ['', Validators.required],
        entregasMaximas: ['', Validators.required],
        precio: ['', Validators.required],
        idCliente: [null, Validators.required]
      }
    )

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
      responsive: true,
      language: {
        emptyTable: 'No hay datos para mostrar en esta tabla',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        },
      },
    }

    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
    })

    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
      this.filteredCustomers = response.data
    })
  }

  get fNew() {
    return this.newRateForm.controls
  }

  onFormNewSubmit() {
    if (this.newRateForm.valid) {
     
      this.loaders.loadingSubmit = true
      this.ratesService.createRate(this.newRateForm.value, this.rateCustomers)
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

  changeGeneral(checked){
    if(checked){
      this.isGeneral = true
      this.fNew.idCliente.setValue(1)
    }
  }

  addCustomerToRate(idCust){
    let customerToAdd: Customer = {}
    this.customers.forEach(value => {
      if(value.idCliente == idCust){
        customerToAdd = value
      }
    })

    if(!this.rateCustomers.includes(customerToAdd)){
      this.rateCustomers.push(customerToAdd)
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

  removeFromArray(item) {
    let i = this.rateCustomers.indexOf(item)
    this.rateCustomers.splice(i, 1)
  }

  onKey(value) {
    this.filteredCustomers = this.search(value) ;
  }

  search(value: string) {
    let filter = value.toLowerCase();
    if(filter != ""){
      return  this.customers.filter(option => option.nomEmpresa.toLowerCase().includes(filter));
    }
    return this.customers
  }

}
