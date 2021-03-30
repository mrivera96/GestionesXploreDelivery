import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../models/user";
import {UsersService} from "../../../../services/users.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {Agency} from "../../../../models/agency";
import {AgenciesService} from "../../../../services/agencies.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-edit-driver-dialog',
  templateUrl: './edit-driver-dialog.component.html',
  styleUrls: ['./edit-driver-dialog.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class EditDriverDialogComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }

  agencies: Agency[]

  edDrivForm: FormGroup
  currDriver: User
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditDriverDialogComponent>,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private agenciesService: AgenciesService
  ) {
    this.currDriver = data.driver
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.initialize()
    this.agenciesService.getAgencies().subscribe(response => {
      this.agencies = response.data
    })
  }

  initialize(){
    this.edDrivForm = this.formBuilder.group({
      'idUsuario':[this.currDriver.idUsuario],
      'nomUsuario': [this.currDriver.nomUsuario, [
        Validators.required,
        Validators.maxLength(80)]
      ],
      'nickUsuario': [this.currDriver.nickUsuario, [
        Validators.required,
        Validators.maxLength(40)]
      ],
      'passcodeUsuario': [this.currDriver.passcodeUsuario, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      'numCelular': [this.currDriver.numCelular, [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)]
      ],
      'idAgencia': [this.currDriver.idAgencia, [
        Validators.required]
      ]
    })
  }

  get f() {
    return this.edDrivForm.controls
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

  onEditFormSubmit() {
    if (this.edDrivForm.valid) {
      this.loaders.loadingSubmit = true
      this.usersService.editDriver(this.edDrivForm.value).subscribe(response => {
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
