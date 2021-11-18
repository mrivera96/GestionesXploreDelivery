import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NickNameValidator } from 'src/app/helpers/nickName.validator';
import { Customer } from 'src/app/models/customer';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-update-query-user',
  templateUrl: './update-query-user.component.html',
  styleUrls: ['./update-query-user.component.css'],
})
export class UpdateQueryUserComponent implements OnInit {
  currentUser: User;
  loading: boolean;
  upUsrForm: FormGroup;
  customers: Customer[];
  assignedCustomers: any[];
  filteredCustomers: Customer[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<UpdateQueryUserComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true;
    this.currentUser = this.data.currUser;
    this.loading = false;

    this.upUsrForm = this.formBuilder.group(
      {
        userId: [this.currentUser.idUsuario, Validators.required],
        userName: [
          this.currentUser.nomUsuario,
          [Validators.required, Validators.maxLength(60)],
        ],
        nickName: [
          this.currentUser.nickUsuario,
          [Validators.required, Validators.maxLength(35)],
        ],
        isActivo: [+this.currentUser.isActivo],
      },
      {
        validator: [NickNameValidator('nickName')],
      }
    );

    this.assignedCustomers = this.currentUser?.query_customers;
  }

  ngOnInit(): void {
    const custSubsc = this.usersService.getCustomers().subscribe((response) => {
      this.customers = response.data;
      this.filteredCustomers = response.data;
      custSubsc.unsubscribe();
    });
  }

  onFormSubmit() {
    if (this.upUsrForm.valid) {
      this.loading = true;
      const usersSubsc = this.usersService
        .updateQueryUser(this.upUsrForm.value, this.assignedCustomers)
        .subscribe(
          (response) => {
            this.loading = false;
            this.openSuccessDialog(
              'Operaión Realizada Correctamente',
              response.message
            );

            usersSubsc.unsubscribe();
          },
          (error) => {
            error.subscribe((err) => {
              this.loading = false;
              this.openErrorDialog(err.statusText);
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
      customer: customer,
    };
    const exists = this.assignedCustomers.find(
      (x) => x.customer.idCliente == obj.customer.idCliente
    );
    if (!exists) {
      this.assignedCustomers.push(obj);
    }
  }

  removeCustomer(customer) {
    const obj = {
      customer: customer,
    };
    const idx = this.assignedCustomers.indexOf(obj.customer);
    this.assignedCustomers.splice(idx, 1);
  }

  onKey(value) {
    this.filteredCustomers = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    filter = filter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (filter != '') {
      return this.customers.filter((option) =>
        option.nomEmpresa
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(filter)
      );
    }
    return this.customers;
  }
}
