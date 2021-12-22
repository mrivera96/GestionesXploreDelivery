import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Schedule } from 'src/app/models/schedule';
import { AuthService } from 'src/app/services/auth.service';
import { RatesService } from 'src/app/services/rates.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shuttle-rate-details',
  templateUrl: './shuttle-rate-details.component.html',
  styleUrls: ['./shuttle-rate-details.component.css'],
})
export class ShuttleRateDetailsComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  currRateDetail: any;
  rateSchedules: Schedule[] = [];
  schdeduleForm: FormGroup;
  assignedSchedules: Schedule[] = [];
  shuttleForm: FormGroup;
  routes: any[];

  constructor(
    private ratesService: RatesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ShuttleRateDetailsComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) {
    this.assignedSchedules = data.RateSchedules;
    this.dialogRef.disableClose = true;
    this.currRateDetail = this.data.RateDetail;

    this.shuttleForm = this.formBuilder.group({
      idTarifa: [this.currRateDetail.idTarifa],
      idRuta: [this.currRateDetail.idRuta, Validators.required],
      idTipoVehiculo:[this.currRateDetail.idTipoVehiculo, Validators.required]
    });

    this.schdeduleForm = this.formBuilder.group({
      cod: [1, Validators.required],
      dia: ['Lunes'],
      inicio: [
        formatDate(new Date().setHours(7, 0, 0), 'HH:mm', 'en'),
        Validators.required,
      ],
      final: [
        formatDate(new Date().setHours(8, 0, 0), 'HH:mm', 'en'),
        Validators.required,
      ],
      descHorario: ['', [Validators.required, Validators.maxLength(60)]],
      limite: [20],
    });
  }

  ngOnInit(): void {
    const rutesSusbcription = this.http.post<any>(`${environment.apiUrl}`,{
      tkn: this.authService.currentUserValue.access_token,
      function: 'getRoutes'
    }).subscribe(response=>{
      this.routes = response.data;
      rutesSusbcription.unsubscribe();
    });
  }

  get schForm() {
    return this.schdeduleForm.controls;
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  openSuccessDialog(succsTitle, succssMsg, close) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    if (close) {
      dialogRef.afterClosed().subscribe((result) => {
        this.dialogRef.close(true);
      });
    }
  }

  onFormSubmit() {
    if (this.shuttleForm.valid) {
      this.loaders.loadingSubmit = true;
      if (this.rateSchedules.length > 0) {
        this.ratesService
          .updateShuttleRateDetail(this.shuttleForm.value, this.rateSchedules)
          .subscribe(
            (response) => {
              this.loaders.loadingSubmit = false;
              this.openSuccessDialog(
                'Operación Realizada Correctamente',
                response.message,
                true
              );
            },
            (error) => {
              error.subscribe((error) => {
                this.loaders.loadingSubmit = false;
                this.openErrorDialog(error.statusText);
              });
            }
          );
      } else {
        this.ratesService
          .updateShuttleRateDetail(this.shuttleForm.value)
          .subscribe(
            (response) => {
              this.loaders.loadingSubmit = false;
              this.openSuccessDialog(
                'Operación Realizada Correctamente',
                response.message,
                true
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

  removeScheduleFromRate(schedule) {
    this.loaders.loadingSubmit = true;
    const rmSchSubscription = this.ratesService
      .removeScheduleFromRate(
        this.currRateDetail.idTarifaDelivery,
        schedule.idHorario
      )
      .subscribe(
        (response) => {
          this.openSuccessDialog(
            'Operación realizada correctamente',
            response.message,
            false
          );
          this.loaders.loadingSubmit = false;
          rmSchSubscription.unsubscribe();
        },
        (error) => {
          error.subscribe((error) => {
            this.openErrorDialog(error.statusText);
            this.loaders.loadingSubmit = false;
            rmSchSubscription.unsubscribe();
          });
        }
      );
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
}
