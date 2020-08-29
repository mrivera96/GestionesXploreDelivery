import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {UsersService} from "../../../services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SuccessModalComponent} from "../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-xplore-add-customer',
  templateUrl: './xplore-add-customer.component.html',
  styleUrls: ['./xplore-add-customer.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreAddCustomerComponent implements OnInit {
  succsMsg
  errorMsg
  nCustomerForm: FormGroup
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<XploreAddCustomerComponent>
  ) {
  }

  ngOnInit(): void {
    this.nCustomerForm = this.formBuilder.group({
      nomEmpresa: ['', [
        Validators.required,
        Validators.maxLength(80)]],
      nomRepresentante: ['', [
        Validators.required,
        Validators.maxLength(80)]],
      numIdentificacion: ['', [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(13)]],
      numTelefono: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)]],
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.maxLength(50)]]
    })
  }

  // getter para fácil acceso a los campos del formulario
  get f() {
    return this.nCustomerForm.controls;
  }

  clearForm() {
    this.nCustomerForm.reset()
  }

  onFormSubmit() {
    if (this.nCustomerForm.valid) {
      this.loaders.loadingSubmit = true
      const usersSubscription = this.usersService.addCustomer(this.nCustomerForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.succsMsg = response.message
        this.openSuccessDialog('Operación Realizada Correctamente', this.succsMsg)
        usersSubscription.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.errorMsg = error.statusText
          this.openErrorDialog(this.errorMsg)
          usersSubscription.unsubscribe()
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
