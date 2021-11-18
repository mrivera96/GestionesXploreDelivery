import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../../../components/shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../../components/shared/success-modal/success-modal.component";
import {Schedule} from "../../../../models/schedule";
import {formatDate} from "@angular/common";
import {SchedulesService} from "../../../../services/schedules.service";

@Component({
  selector: 'app-edit-schedule-dialog',
  templateUrl: './edit-schedule-dialog.component.html',
  styleUrls: ['./edit-schedule-dialog.component.css']
})
export class EditScheduleDialogComponent implements OnInit {
  loaders = {
    'loadingSubmit': false
  }
  editSchForm: FormGroup
  currentSchedule: Schedule

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private schedulesService: SchedulesService
  ) {
    this.currentSchedule = data.schedule
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
  }

  get f(){
    return this.editSchForm.controls
  }

  initialize() {
    this.editSchForm = this.formBuilder.group({
      scheduleId: [this.currentSchedule.idHorario],
      inicio: [formatDate('2020-06-29 ' + this.currentSchedule?.inicio, 'HH:mm', 'en'), [Validators.required]],
      final: [formatDate('2020-06-29 ' + this.currentSchedule?.final, 'HH:mm', 'en'), [Validators.required]]
    })
  }

  onEditFormSubmit() {
    if(this.editSchForm.valid){
      this.loaders.loadingSubmit = true
      this.schedulesService.editSchedule(this.editSchForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.loaders.loadingSubmit = false
            this.openErrorDialog(error.statusText)
          })
        }
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
}
