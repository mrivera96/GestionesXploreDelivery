import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {BranchService} from "../../../../services/branch.service";
import {Branch} from "../../../../models/branch";
import {SuccessModalComponent} from "../../../shared/success-modal/success-modal.component";
import {ErrorModalComponent} from "../../../shared/error-modal/error-modal.component";
import {HttpClient} from "@angular/common/http";
import {BlankSpacesValidator} from "../../../../helpers/blankSpaces.validator";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html'
})
export class EditDialogComponent implements OnInit {
  edBranchForm: FormGroup
  currBranch: Branch
  loaders = {
    'loadingSubmit': false
  }
  places: []
  gcords = false
  @ViewChild('branchCords')
  branchCords: ElementRef

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private branchService: BranchService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.currBranch = data.branch
  }

  ngOnInit(): void {
    this.edBranchForm = this.formBuilder.group(
      {
        idSucursal: [this.currBranch.idSucursal],
        nomSucursal: [this.currBranch.nomSucursal, Validators.required],
        numTelefono: [this.currBranch.numTelefono, [Validators.minLength(9), Validators.maxLength(9)]],
        direccion: [this.currBranch.direccion, Validators.required]
      }, {
        validators: [
          BlankSpacesValidator('nomSucursal'),
          BlankSpacesValidator('direccion')
        ]
      }
    )
  }

  searchAddress(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiUrl}`, {lugar: lugar, function: 'searchPlace'})
      .subscribe(response => {
        this.places = response
      })
  }


  setCurrentLocation(checked) {
    if (!checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function () {
        }, function () {
        }, {})
        navigator.geolocation.getCurrentPosition(pos => {
          const destCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude)
          this.edBranchForm.get('direccion').setValue(destCords)
        })
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.edBranchForm.get('direccion').setValue('')
    }

  }

  submitEditBranch() {
    if (this.edBranchForm.valid) {
      this.loaders.loadingSubmit = true
      this.branchService.editBranch(this.edBranchForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.openSuccessDialog('Operación Realizada Correctamente', response.message)
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.openErrorDialog(error.statusText)
            })
          })
    }
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

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  setCords() {
    this.edBranchForm.get('direccion').setValue(this.branchCords.nativeElement.value)
    this.gcords = false
  }

}
