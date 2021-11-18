import { Component, Inject, OnInit } from '@angular/core';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { Customer } from '../../../../models/customer';
import { Surcharge } from '../../../../models/surcharge';
import { SurchargesService } from '../../../../services/surcharges.service';
import { Category } from '../../../../models/category';
import { CategoriesService } from '../../../../services/categories.service';
import { RateType } from '../../../../models/rate-type';
import { RatesService } from '../../../../services/rates.service';

@Component({
  selector: 'app-edit-surcharge-dialog',
  templateUrl: './edit-surcharge-dialog.component.html',
  styleUrls: ['./edit-surcharge-dialog.component.css'],
})
export class EditSurchargeDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  edSurChForm: FormGroup;
  customers: Customer[];
  filteredCustomers: Customer[];
  currSurch: Surcharge;
  categories: Category[] = [];
  deliveryTypes: RateType[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private surchargesService: SurchargesService,
    private categoriesServices: CategoriesService,
    private ratesService: RatesService,
    public dialogRef: MatDialogRef<EditSurchargeDialogComponent>
  ) {
    this.currSurch = data.surcharge;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.edSurChForm = this.formBuilder.group({
      idRecargo: [this.currSurch.idRecargo],
      descRecargo: [this.currSurch.descRecargo, Validators.required],
      kilomMinimo: [this.currSurch.kilomMinimo, Validators.required],
      kilomMaximo: [this.currSurch.kilomMaximo, Validators.required],
      monto: [this.currSurch.monto, Validators.required],
      idCliente: [1, Validators.required],
      idCategoria: [this.currSurch.idCategoria, Validators.required],
      idTipoEnvio: [1, Validators.required],
      tYK: [this.currSurch?.item_detail?.tYK || 0, Validators.min(0)],
      cobVehiculo: [
        this.currSurch?.item_detail?.cobVehiculo || 0,
        Validators.min(0),
      ],
      servChofer: [
        this.currSurch?.item_detail?.servChofer || 0,
        Validators.min(0),
      ],
      recCombustible: [
        this.currSurch?.item_detail?.recCombustible || 0,
        Validators.min(0),
      ],
      cobTransporte: [
        this.currSurch?.item_detail?.cobTransporte || 0,
        Validators.min(0),
      ],
      isv: [this.currSurch?.item_detail?.isv || 0, Validators.min(0)],
      tasaTuris: [
        this.currSurch?.item_detail?.tasaTuris || 0,
        Validators.min(0),
      ],
      gastosReembolsables: [
        this.currSurch?.item_detail?.gastosReembolsables || 0,
        Validators.min(0),
      ],
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

  get f() {
    return this.edSurChForm.controls;
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  onFormEditSubmit() {
    if (this.edSurChForm.valid) {
      this.loaders.loadingSubmit = true;
      const tk = parseFloat(this.f.tYK.value) ?? 0;
      const cobVeh = parseFloat(this.f.cobVehiculo.value) ?? 0;
      const servChof = parseFloat(this.f.servChofer.value) ?? 0;
      const recComb = parseFloat(this.f.recCombustible.value) ?? 0;
      const cobTrans = parseFloat(this.f.cobTransporte.value) ?? 0;
      const isv = parseFloat(this.f.isv.value) ?? 0;
      const tasaTur = parseFloat(this.f.tasaTuris.value) ?? 0;
      const gastRe = parseFloat(this.f.gastosReembolsables.value) ?? 0;

      if (
        tk != 0 ||
        cobVeh != 0 ||
        servChof != 0 ||
        recComb != 0 ||
        cobTrans != 0 ||
        isv != 0 ||
        tasaTur != 0 ||
        gastRe != 0
      ) {
        const sum =
          tk + cobVeh + servChof + recComb + cobTrans + isv + tasaTur + gastRe;

        if (+sum != +this.f.monto.value) {
          this.openErrorDialog(
            'Los valores ingresados para facturación, no coinciden con el monto del recargo'
          );
          this.loaders.loadingSubmit = false;
        } else {
          this.surchargesService
            .editSurcharge(this.edSurChForm.value)
            .subscribe(
              (response) => {
                this.loaders.loadingSubmit = false;
                this.openSuccessDialog(
                  'Operación Realizada Correctamente',
                  response.message
                );
              },
              (error) => {
                error.subscribe((error) => {
                  this.loaders.loadingSubmit = false;
                  this.openErrorDialog(error.statusText);
                });
              }
            );
        }
      } else {
        this.surchargesService.editSurcharge(this.edSurChForm.value).subscribe(
          (response) => {
            this.loaders.loadingSubmit = false;
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
          },
          (error) => {
            error.subscribe((error) => {
              this.loaders.loadingSubmit = false;
              this.openErrorDialog(error.statusText);
            });
          }
        );
      }
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
