import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { RatesService } from '../../../../services/rates.service';
import { CategoriesService } from '../../../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Category } from '../../../../models/category';
import { Customer } from '../../../../models/customer';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../../shared/components/success-modal/success-modal.component';
import { Subject } from 'rxjs';
import { RateType } from 'src/app/models/rate-type';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Schedule } from '../../../../models/schedule';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-rate-dialog',
  templateUrl: './new-rate-dialog.component.html',
  styleUrls: ['./new-rate-dialog.component.css'],
})
export class NewRateDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any;
  newRateForm: FormGroup;
  customers: Customer[];
  rateCustomers: Customer[] = [];
  filteredCustomers: Customer[];
  categories: Category[];
  isGeneral: boolean = false;
  rateTypes: RateType[];
  consolidatedForm: FormGroup;
  places = [];
  schedules: Schedule[];
  schdeduleForm: FormGroup;
  rateSchedules: Schedule[] = [];
  shuttleForm: FormGroup;
  routes: any[];

  constructor(
    private ratesService: RatesService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    public dialog: MatDialog,
    private categoriesService: CategoriesService,
    public dialogRef: MatDialogRef<any>,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.dialogRef.disableClose = true;
    this.newRateForm = this.formBuilder.group({
      descTarifa: ['', Validators.required],
      idCategoria: [null, Validators.required],
      entregasMinimas: ['', Validators.required],
      entregasMaximas: ['', Validators.required],
      precio: ['', Validators.required],
      idCliente: [null],
      idTipoTarifa: [null, Validators.required],
    });

    this.consolidatedForm = this.formBuilder.group({
      radioMaximo: [1, Validators.required],
      dirRecogida: ['', Validators.required],
      radioMaximoEntrega: [1],
      dirEntrega: [''],
    });

    this.shuttleForm = this.formBuilder.group({
      idRuta: [null, Validators.required],
      idTipoVehiculo:[null, Validators.required]
    });

    this.schdeduleForm = this.formBuilder.group({
      cod: [1, Validators.required],
      dia: ['Lunes'],
      inicio: [
        formatDate(new Date().setHours(7, 0, 0), 'HH:mm', 'en'),
        Validators.required,
      ],
      final: [
        formatDate(new Date().setHours(16, 0, 0), 'HH:mm', 'en'),
        Validators.required,
      ],
      descHorario: ['', [Validators.required, Validators.maxLength(60)]],
      limite:[20]
    });

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
          previous: 'Ant.',
        },
      },
    };
  }

  ngOnInit(): void {
    
    const usersSubscription = this.usersService
      .getCustomers()
      .subscribe((response) => {
        this.customers = response.data;
        this.filteredCustomers = response.data;
        usersSubscription.unsubscribe();
      });

    const categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe((response) => {
        this.categories = response.data;
        this.loaders.loadingData = false;
        categoriesSubscription.unsubscribe();
      });

    const ratesSubscription = this.ratesService
      .getRateTypes()
      .subscribe((response) => {
        this.rateTypes = response.data;
        ratesSubscription.unsubscribe();
      });

    const rutesSusbcription = this.http.post<any>(`${environment.apiUrl}`,{
      tkn: this.authService.currentUserValue.access_token,
      function: 'getRoutes'
    }).subscribe(response=>{
      this.routes = response.data;
      rutesSusbcription.unsubscribe();
    });
  }

  get fNew() {
    return this.newRateForm.controls;
  }

  get consForm() {
    return this.consolidatedForm.controls;
  }

  get schForm() {
    return this.schdeduleForm.controls;
  }

  onFormNewSubmit() {
    if (
      this.fNew.idTipoTarifa.value == 2 ||
      this.fNew.idTipoTarifa.value == 4
    ) {
      if (this.newRateForm.valid && this.consolidatedForm.valid) {
        this.loaders.loadingSubmit = true;
        this.ratesService
          .createRate(
            this.newRateForm.value,
            this.rateCustomers,
            this.consolidatedForm.value,
            this.rateSchedules
          )
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
    }else if (
      this.fNew.idTipoTarifa.value == 5
    ) {
      if (this.newRateForm.valid && this.shuttleForm.valid) {
        this.loaders.loadingSubmit = true;
        this.ratesService
          .createRate(
            this.newRateForm.value,
            this.rateCustomers,
            this.shuttleForm.value,
            this.rateSchedules
          )
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
      if (this.newRateForm.valid) {
        this.loaders.loadingSubmit = true;
        this.ratesService
          .createRate(this.newRateForm.value, this.rateCustomers)
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

  addCustomerToRate(idCust) {
    let customerToAdd: Customer = {};
    this.customers.forEach((value) => {
      if (value.idCliente == idCust) {
        customerToAdd = value;
      }
    });

    if (!this.rateCustomers.includes(customerToAdd)) {
      this.rateCustomers.push(customerToAdd);
    }
  }

  addScheduleToRate(schedule) {
    let scheduleToAdd: Schedule = {};
    scheduleToAdd.descHorario = schedule.descHorario;
    scheduleToAdd.cod = schedule.cod;
    scheduleToAdd.dia = schedule.dia;
    scheduleToAdd.inicio = schedule.inicio;
    scheduleToAdd.final = schedule.final;
    scheduleToAdd.limite = schedule.limite;

    if (!this.rateSchedules.includes(scheduleToAdd)) {
      this.rateSchedules.push(scheduleToAdd);
    }
  }

  removeSchdeuleFromArray(item) {
    let i = this.rateSchedules.indexOf(item);
    this.rateSchedules.splice(i, 1);
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
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

  removeFromArray(item) {
    let i = this.rateCustomers.indexOf(item);
    this.rateCustomers.splice(i, 1);
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

  searchAddress(event) {
    let lugar = event.target.value;
    if (lugar.trim().length >= 5) {
      const placeSubscription = this.http
        .post<any>(`${environment.apiUrl}`, {
          lugar: lugar,
          function: 'searchPlace',
        })
        .subscribe((response) => {
          this.places = response;
          placeSubscription.unsubscribe();
        });
    }
  }

  setDay(dayCod) {
    const days = [
      {
        cod: 1,
        dia: 'Lunes',
      },
      {
        cod: 2,
        dia: 'Martes',
      },
      {
        cod: 3,
        dia: 'Miércoles',
      },
      {
        cod: 4,
        dia: 'Jueves',
      },
      {
        cod: 5,
        dia: 'Viernes',
      },
      {
        cod: 6,
        dia: 'Sábado',
      },
      {
        cod: 0,
        dia: 'Domingo',
      },
    ];

    days.forEach((day) => {
      if (day.cod == dayCod) {
        this.schdeduleForm.get('dia').setValue(day.dia);
      }
    });
  }

  updateValidator(idTipoTarifa) {
    if (idTipoTarifa == 4) {
      this.consForm.radioMaximoEntrega.setValidators([Validators.required]);
      this.consForm.dirEntrega.setValidators([Validators.required]);
    } else {
      this.consForm.radioMaximoEntrega.setValidators(null);
      this.consForm.dirEntrega.setValidators(null);
    }
  }
}
