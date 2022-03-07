import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../../services/users.service';
import { SurchargesService } from '../../../../services/surcharges.service';
import { Customer } from '../../../../models/customer';
import { Category } from '../../../../models/category';
import { CategoriesService } from '../../../../services/categories.service';
import { RateType } from '../../../../models/rate-type';
import { RatesService } from '../../../../services/rates.service';

@Component({
  selector: 'app-new-surcharge-dialog',
  templateUrl: './new-surcharge-dialog.component.html',
  styleUrls: ['./new-surcharge-dialog.component.css'],
})
export class NewSurchargeDialogComponent implements OnInit {
  newSurchForm: FormGroup;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  customers: Customer[] = [];
  categories: Category[] = [];
  filteredCustomers: Customer[];
  surchargeCategories: Category[] = [];
  isGeneral: boolean = false;
  surchargeCustomers: Customer[] = [];
  deliveryTypes: RateType[] = [];
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private usersService: UsersService,
    private categoriesServices: CategoriesService,
    private ratesService: RatesService,
    private surchargesService: SurchargesService,
    public dialogRef: MatDialogRef<NewSurchargeDialogComponent>
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.newSurchForm = this.formBuilder.group({
      descRecargo: ['', Validators.required],
      kilomMinimo: ['', Validators.required],
      kilomMaximo: ['', Validators.required],
      monto: ['', Validators.required],
      idCliente: [null],
      idCategoria: [null, Validators.required],
      idTipoEnvio: [1, Validators.required],
      tYK: [0],
      cobVehiculo: [0],
      servChofer: [0],
      recCombustible: [0],
      cobTransporte: [0],
      isv: [0],
      tasaTuris: [0],
      gastosReembolsables: [0],
      transportePersonas: [0],
    });

    const usersSubscription = this.usersService
      .getCustomers()
      .subscribe((response) => {
        this.customers = response.data;
        this.filteredCustomers = response.data;
        usersSubscription.unsubscribe();
      });

    const categoriesSubscription = this.categoriesServices
      .getAllCategories()
      .subscribe((response) => {
        this.categories = response.data;
        categoriesSubscription.unsubscribe();
      });

    const ratesSubscripion = this.ratesService
      .getRateTypes()
      .subscribe((response) => {
        this.deliveryTypes = response.data;
        ratesSubscripion.unsubscribe();
      });
  }
  get fNew() {
    return this.newSurchForm.controls;
  }

  onFormNewSubmit() {
    if (this.newSurchForm.valid) {
      this.loaders.loadingSubmit = true;
      const tk = this.fNew.tYK.value;
      const cobVeh = this.fNew.cobVehiculo.value;
      const servChof = this.fNew.servChofer.value;
      const recComb = this.fNew.recCombustible.value;
      const cobTrans = this.fNew.cobTransporte.value;
      const isv = this.fNew.isv.value;
      const tasaTur = this.fNew.tasaTuris.value;
      const gastRe = this.fNew.gastosReembolsables.value;
      const transPer = this.fNew.transportePersonas.value;

      if (
        tk != 0 ||
        cobVeh != 0 ||
        servChof != 0 ||
        recComb != 0 ||
        cobTrans != 0 ||
        isv != 0 ||
        tasaTur != 0 ||
        gastRe != 0 ||
        transPer != 0
      ) {
        const sum =
          tk + cobVeh + servChof + recComb + cobTrans + isv + tasaTur + gastRe + transPer;

        if (sum != this.fNew.monto.value) {
          this.openErrorDialog(
            'Los valores ingresados para facturación, no coinciden con el monto del recargo'
          );
          this.loaders.loadingSubmit = false;
        } else {
          const surchSubsc = this.surchargesService
            .createSurcharge(this.newSurchForm.value, this.surchargeCustomers)
            .subscribe(
              (response) => {
                this.loaders.loadingSubmit = false;
                surchSubsc.unsubscribe();
                this.openSuccessDialog(
                  'Operación Realizada Correctamente',
                  response.message
                );
              },
              (error) => {
                error.subscribe((error) => {
                  this.loaders.loadingSubmit = false;
                  surchSubsc.unsubscribe();
                  this.openErrorDialog(error.statusText);
                });
              }
            );
        }
      } else {
        const surchSubsc = this.surchargesService
          .createSurcharge(this.newSurchForm.value, this.surchargeCustomers)
          .subscribe(
            (response) => {
              this.loaders.loadingSubmit = false;
              surchSubsc.unsubscribe();
              this.openSuccessDialog(
                'Operación Realizada Correctamente',
                response.message
              );
            },
            (error) => {
              error.subscribe((error) => {
                this.loaders.loadingSubmit = false;
                surchSubsc.unsubscribe();
                this.openErrorDialog(error.statusText);
              });
            }
          );
      }
    }
  }

  changeGeneral(checked) {
    if (checked) {
      this.isGeneral = true;
      this.fNew.idCliente.setValue(1);
    } else {
      this.isGeneral = false;
      this.fNew.idCliente.setValue(null);
    }
  }

  addCustomerToSurcharge(idCust) {
    let customerToAdd: Customer = {};
    this.customers.forEach((value) => {
      if (value.idCliente == idCust) {
        customerToAdd = value;
      }
    });

    if (!this.surchargeCustomers.includes(customerToAdd)) {
      this.surchargeCustomers.push(customerToAdd);
    }
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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

  removeFromArray(item) {
    let i = this.surchargeCustomers.indexOf(item);
    this.surchargeCustomers.splice(i, 1);
  }
}
