import { Component, OnInit } from '@angular/core'
import { animate, style, transition, trigger } from "@angular/animations"
import { Customer } from "../../../../models/customer"
import { UsersService } from "../../../../services/users.service"
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import {Router} from "@angular/router";

@Component({
  selector: 'app-customer-choose',
  templateUrl: './customer-choose.component.html',
  styleUrls: ['./customer-choose.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CustomerChooseComponent implements OnInit {
  deliveryType: number = 0
  deliveryTypes = [
    { id: 1, desc: 'Normal' },
    // { id: 3, desc: 'Ruteo' }
  ]
  loaders = {
    'loadingData': false,
    'loadingSubmit': false
  }
  selectedCustomer = null
  selectedDeliveryType = null
  customers: Customer[] = []
  filteredCustomers: Customer[] = []
  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerChooseComponent>,
    private router: Router
  ) {
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {

  }

  loadData() {
    this.loaders.loadingData = true
    const usersSubsc = this.usersService
      .getCustomers()
      .subscribe(response => {
        this.customers = response.data
        this.filteredCustomers = response.data
        this.loaders.loadingData = false
        usersSubsc.unsubscribe()
      })
  }

  onKey(value) {
    if(value != " "){
      this.filteredCustomers = this.search(value)
    }

  }

  search(value: string) {
    let filter = value.toLowerCase()
    filter = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    if (filter != "") {
      return this.customers.filter(option => option.nomEmpresa.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter))
    }
    return this.customers
  }

  validateCustomer(form) {
    const customer = this.customers.find(x => x.idCliente == +form.selectedCustomer)

    const deliveryType = +form.selectedDeliveryType
    const result = { customer: customer, delType: deliveryType }

    this.dialogRef.close(result)
  }

  checkDelTypes(customerId) {
    this.deliveryTypes = [
      { id: 1, desc: 'Normal' },
      // { id: 3, desc: 'Ruteo' }
    ]
    const usrSubs = this.usersService
      .checkCustomerDelTypes(customerId)
      .subscribe(response => {
        if(response.data.consolidated == true){
          this.deliveryTypes.push({id: 2, desc: 'Carga Consolidada'})
        }

        if(response.data.consolidated == true){
          this.deliveryTypes.push({id: 3, desc: 'Ruteo'})
        }

        /* if(response.data.foreign == true){
          this.deliveryTypes.push({id: 4, desc: 'Carga Consolidada Foránea'})
        } */
        usrSubs.unsubscribe()
      })
  }

}
