import { Component, OnInit } from '@angular/core';
import {Agency} from "../../../../models/agency";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UsersService} from "../../../../services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AgenciesService} from "../../../../services/agencies.service";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";

@Component({
  selector: 'app-new-driver-dialog',
  templateUrl: './new-driver-dialog.component.html',
  styleUrls: ['./new-driver-dialog.component.css']
})
export class NewDriverDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  agencies: Agency[]
  nDrivForm: FormGroup

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewDriverDialogComponent>,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private agenciesService: AgenciesService
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.agenciesService.getAgencies().subscribe(response => {
      this.agencies = response.data
    })
  }

  initialize(){
    this.nDrivForm = this.formBuilder.group({
      'nomUsuario': ['', [
        Validators.required,
        Validators.maxLength(80)]
      ],
      'nickUsuario': ['', [
        Validators.required,
        Validators.maxLength(40)]
      ],
      'passcodeUsuario': ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      'numCelular': ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)]
      ],
      'idAgencia': [null, [
        Validators.required]
      ]
    })
  }

  get f() {
    return this.nDrivForm.controls
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

  onNewFormSubmit() {
    if (this.nDrivForm.valid) {
      this.loaders.loadingSubmit = true
      this.usersService.addDriver(this.nDrivForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.openErrorDialog(error.statusText)
        })
      })
    }
  }

}
