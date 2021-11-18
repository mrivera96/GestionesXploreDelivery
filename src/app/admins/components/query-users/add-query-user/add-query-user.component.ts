import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BlankSpacesValidator } from 'src/app/helpers/blankSpaces.validator';
import { MustMatch } from 'src/app/helpers/mustMatch.validator';
import { NickNameValidator } from 'src/app/helpers/nickName.validator';
import { PasswordValidate } from 'src/app/helpers/passwordValidation.validator';
import { Customer } from 'src/app/models/customer';
import { UsersService } from 'src/app/services/users.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-add-query-user',
  templateUrl: './add-query-user.component.html',
  styleUrls: ['./add-query-user.component.css'],
})
export class AddQueryUserComponent implements OnInit {
  loading = false;
  nUsrForm: FormGroup;
  customers: Customer[];
  assignedCustomers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AddQueryUserComponent>
  ) {
    this.dialogRef.disableClose = true;
    this.nUsrForm = this.formBuilder.group(
      {
        userName: ['', [Validators.required, Validators.maxLength(60)]],
        nickName: ['', [Validators.required, Validators.maxLength(35)]],
        secret: ['', [Validators.required, Validators.minLength(8)]],
        confirmSecret: ['', [Validators.required]],
      },
      {
        validator: [
          MustMatch('secret', 'confirmSecret'),
          PasswordValidate('secret'),
          BlankSpacesValidator('secret'),
          NickNameValidator('nickName'),
        ],
      }
    );
  }

  ngOnInit(): void {
    const custSubsc = this.usersService.getCustomers().subscribe((response) => {
      this.customers = response.data;
      custSubsc.unsubscribe();
    });
  }

  onFormSubmit() {
    if (this.nUsrForm.valid) {
      this.loading = true;
      const usrsSubsc = this.usersService
        .addQueryUser(this.nUsrForm.value, this.assignedCustomers)
        .subscribe(
          (response) => {
            this.loading = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            usrsSubsc.unsubscribe();
          },
          (error) => {
            error.subscribe((err) => {
              this.openErrorDialog(err.statusText);
              usrsSubsc.unsubscribe();
              this.loading = false;
            });
          }
        );
    }
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  addCustomer(customer) {
    const obj = {
      customer: customer
    };
    const exists = this.assignedCustomers.find(x=> x.customer.idCliente == obj.customer.idCliente);
    if(!exists){
      this.assignedCustomers.push(obj);
    }
    
  }

  removeCustomer(customer){
    const obj = {
      customer: customer
    };
    const idx = this.assignedCustomers.indexOf(obj.customer);
    this.assignedCustomers.splice(idx, 1);
  }
}
