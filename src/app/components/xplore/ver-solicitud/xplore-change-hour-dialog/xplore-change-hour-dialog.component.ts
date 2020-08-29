import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Delivery} from "../../../../models/delivery";
import {formatDate} from "@angular/common";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {Schedule} from "../../../../models/schedule";
@Component({
  selector: 'app-xplore-change-hour-dialog',
  templateUrl: './xplore-change-hour-dialog.component.html',
  styleUrls: ['./xplore-change-hour-dialog.component.css']
})
export class XploreChangeHourDialogComponent implements OnInit {

  loaders = {
    'loadingSubmit': false
  }
  changeForm: FormGroup
  currDelivery: Delivery
  today: number
  todaySchedule: Schedule
  hInit
  hFin
  constructor(
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    public dialogRef: MatDialogRef<XploreChangeHourDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    this.currDelivery = this.data.delivery
  }

  ngOnInit(): void {
    this.todaySchedule = JSON.parse(localStorage.getItem('todaySchedule'))
    this.hInit = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      null, Number(this.todaySchedule?.inicio.split(':')[0]), Number(this.todaySchedule?.inicio.split(':')[1])),
      'hh:mm a', 'en')

    this.hFin = formatDate(new Date(new Date().getFullYear(), new Date().getMonth(),
      null, Number(this.todaySchedule?.final.split(':')[0]), Number(this.todaySchedule?.final.split(':')[1])),
      'hh:mm a', 'en')
    this.initialize()
  }

  initialize() {
    this.changeForm = this.formBuilder.group({
      idDelivery: [this.currDelivery.idDelivery],
      fecha: [formatDate(new Date(this.currDelivery.fechaNoFormatted), 'yyyy-MM-dd', 'en'), Validators.required],
      hora: [formatDate(new Date(this.currDelivery.fechaNoFormatted), 'HH:mm', 'en'), Validators.required]
    })
  }

  get f() {
    return this.changeForm.controls
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

  onEditFormSubmit() {
    if (this.changeForm.valid) {
      this.loaders.loadingSubmit = true
      const deliveriesSubscription = this.deliveriesService.changeDeliveryHour(this.changeForm.value).subscribe(response => {
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        deliveriesSubscription.unsubscribe()
      }, error => {
        this.loaders.loadingSubmit = false
        error.subscribe(error => {
          this.openErrorDialog(error.statusText)
          deliveriesSubscription.unsubscribe()
        })
        
      })
    }
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

}
