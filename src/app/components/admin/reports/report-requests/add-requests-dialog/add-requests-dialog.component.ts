import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReportRequestsService} from "../../../../../services/report-requests.service";
import {UsersService} from "../../../../../services/users.service";
import {Customer} from "../../../../../models/customer";
import {SuccessModalComponent} from "../../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../../shared/error-modal/error-modal.component";

@Component({
  selector: 'app-add-requests-dialog',
  templateUrl: './add-requests-dialog.component.html',
  styleUrls: ['./add-requests-dialog.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class AddRequestsDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  requestForm: FormGroup
  customers: Customer[] = []
  filteredCustomers: Customer[] = []

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private reportRequestService: ReportRequestsService,
    private usersService: UsersService
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.requestForm = this.formBuilder.group({
      idCliente: [null, Validators.required],
      correo: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.maxLength(50)
      ]]
    })
  }

  loadData() {
    this.loaders.loadingData = true
    const usersSubscription = this.usersService.getCustomers()
      .subscribe(response => {
        this.customers = response.data
        this.filteredCustomers = response.data
        this.loaders.loadingData = false
          usersSubscription.unsubscribe()
      })
  }

  formSubmit(){
    if(this.requestForm.valid){
      const requestSubsc = this.reportRequestService.createReportRequests(this.requestForm.value)
        .subscribe(response => {
          this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          requestSubsc.unsubscribe()
        }, error =>{
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
          })
        })
    }
  }

  get f(){
    return this.requestForm.controls
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
    if(filter != ""){
      return  this.customers.filter(option => option.nomEmpresa.toLowerCase().includes(filter));
    }
    return this.customers
  }

}
