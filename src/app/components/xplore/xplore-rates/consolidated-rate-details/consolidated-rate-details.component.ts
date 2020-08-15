import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RatesService} from "../../../../services/rates.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {ConsolidatedRateDetail} from "../../../../models/consolidated-rate-detail";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {environment} from "../../../../../environments/environment";
import {formatDate} from "@angular/common";
import {Schedule} from "../../../../models/schedule";

@Component({
  selector: 'app-consolidated-rate-details',
  templateUrl: './consolidated-rate-details.component.html',
  styles: []
})
export class ConsolidatedRateDetailsComponent implements OnInit {
  consolidatedForm: FormGroup
  places = []
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  currRateDetail: ConsolidatedRateDetail
  rateSchedules: Schedule[] = []
  schdeduleForm: FormGroup
  assignedSchedules: Schedule[] = []

  constructor(
    private ratesService: RatesService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.currRateDetail = this.data.RateDetail
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  loadData(){
    this.loaders.loadingData = true
    const schedulesSubscription = this.ratesService.getRateSchedules(this.currRateDetail.idTarifaDelivery)
      .subscribe(response => {
        this.assignedSchedules = response.data
        this.loaders.loadingData = false
        schedulesSubscription.unsubscribe()
      })
  }

  initialize() {
    this.consolidatedForm = this.formBuilder.group(
      {
        idTarifaDelivery: [this.currRateDetail.idTarifaDelivery],
        radioMaximo: [this.currRateDetail.radioMaximo, Validators.required],
        dirRecogida: [this.currRateDetail.dirRecogida, Validators.required]
      }
    )

    this.schdeduleForm = this.formBuilder.group(
      {
        cod: [1, Validators.required],
        dia: ['Lunes'],
        inicio: [formatDate(new Date().setHours(7, 0, 0), 'HH:mm', 'en'), Validators.required],
        final: [formatDate(new Date().setHours(16, 0, 0), 'HH:mm', 'en'), Validators.required],
        descHorario: ['', [Validators.required, Validators.maxLength(60)]]
      }
    )
  }

  get schForm() {
    return this.schdeduleForm.controls
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  openSuccessDialog(succsTitle, succssMsg, close) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    if(close){
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close(true)
      })
    }

  }

  searchAddress(event) {
    let lugar = event.target.value
    if (lugar.trim().length >= 5) {
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {
        lugar: lugar,
        function: 'searchPlace'
      }).subscribe(response => {
        this.places = response
        placeSubscription.unsubscribe()
      })
    }
  }

  onFormSubmit() {
    if (this.consolidatedForm.valid) {
      this.loaders.loadingSubmit = true
      if (this.rateSchedules.length > 0) {
        this.ratesService.updateConsolidatedRateDetail(this.consolidatedForm.value,this.rateSchedules)
          .subscribe(response => {
              this.loaders.loadingSubmit = false
              this.openSuccessDialog('Operación Realizada Correctamente', response.message, true)
            },
            error => {
              error.subscribe(error => {
                this.loaders.loadingSubmit = false
                this.openErrorDialog(error.statusText)
              })
            })
      } else {
        this.ratesService.updateConsolidatedRateDetail(this.consolidatedForm.value)
          .subscribe(response => {
              this.loaders.loadingSubmit = false
              this.openSuccessDialog('Operación Realizada Correctamente', response.message, true)
            },
            error => {
              error.subscribe(error => {
                this.loaders.loadingSubmit = false
                this.openErrorDialog(error.statusText)
              })
            })
      }

    }
  }

  addScheduleToRate(schedule) {
    let scheduleToAdd: Schedule = {}
    scheduleToAdd.descHorario = schedule.descHorario
    scheduleToAdd.cod = schedule.cod
    scheduleToAdd.dia = schedule.dia
    scheduleToAdd.inicio = schedule.inicio
    scheduleToAdd.final = schedule.final

    if (!this.rateSchedules.includes(scheduleToAdd)) {
      this.rateSchedules.push(scheduleToAdd)
    }
  }

  removeSchdeuleFromArray(item) {
    let i = this.rateSchedules.indexOf(item)
    this.rateSchedules.splice(i, 1)
  }

  removeScheduleFromRate(schedule) {
    this.loaders.loadingSubmit = true
   const rmSchSubscription = this.ratesService.removeScheduleFromRate(this.currRateDetail.idTarifaDelivery, schedule.idHorario)
     .subscribe(response => {
       this.openSuccessDialog('Operación realizada correctamente', response.message, false)
       this.loaders.loadingSubmit = false
       rmSchSubscription.unsubscribe()
       this.loadData()
     },error => {
       error.subscribe(error => {
         this.openErrorDialog(error.statusText)
         this.loaders.loadingSubmit = false
         rmSchSubscription.unsubscribe()
       })

     })
  }

  setDay(dayCod) {
    const days = [
      {
        cod: 1,
        dia: 'Lunes'
      }, {
        cod: 2,
        dia: 'Martes'
      }, {
        cod: 3,
        dia: 'Miércoles'
      }, {
        cod: 4,
        dia: 'Jueves'
      }, {
        cod: 5,
        dia: 'Viernes'
      }, {
        cod: 6,
        dia: 'Sábado'
      }, {
        cod: 0,
        dia: 'Domingo'
      }
    ]

    days.forEach(day => {
      if (day.cod == dayCod) {
        this.schdeduleForm.get('dia').setValue(day.dia)
      }
    })
  }

}
