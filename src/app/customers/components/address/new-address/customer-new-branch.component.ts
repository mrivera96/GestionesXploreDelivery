import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {BranchService} from "../../../../services/branch.service";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ErrorModalComponent} from "../../../../shared/components/error-modal/error-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../../../shared/components/success-modal/success-modal.component";
import {BlankSpacesValidator} from "../../../../helpers/blankSpaces.validator";


@Component({
  selector: 'app-customer-new-branch',
  templateUrl: './customer-new-branch.component.html',
  styleUrls: ['./customer-new-branch.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerNewBranchComponent implements OnInit {
  succsMsg
  errorMsg
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  nBranchForm: FormGroup
  places = []
  gcords = false
  @ViewChild('branchCords') branchCords: ElementRef

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private http: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CustomerNewBranchComponent>
  ) {
  }

  ngOnInit(): void {
    this.nBranchForm = this.formBuilder.group(
      {
        nomSucursal: ['', Validators.required],
        numTelefono: ['', [Validators.minLength(9), Validators.maxLength(9)]],
        direccion: ['', Validators.required],
        instrucciones: ['',Validators.maxLength(150)],
        isDefault:[false, Validators.required]
      },{
        validators: [
          BlankSpacesValidator('nomSucursal'),
          BlankSpacesValidator('direccion')
        ]
      }
    )
  }

  onSubmitForm() {
    if (this.nBranchForm.valid) {
      this.loaders.loadingSubmit = true
      const branchSubscription = this.branchService.newBranch(this.nBranchForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.succsMsg = response.message
        this.openSuccessDialog('Operación Realizada Correctamente', this.succsMsg)
        branchSubscription.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.errorMsg = error.statusText
          this.openErrorDialog(this.errorMsg)
          branchSubscription.unsubscribe()
        })
      })
    }
  }

  get f(){
    return this.nBranchForm.controls
  }

  changeDefault(){
    this.f.isDefault.setValue(!this.f.isDefault.value)
  }

  searchAddress(event) {
    let lugar = event.target.value
    if(lugar.trim().length >= 5){
      const placeSubscription = this.http.post<any>(`${environment.apiUrl}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
        this.places = response
        placeSubscription.unsubscribe()
      })
    }
  }

  setCurrentLocation(checked) {
    if (!checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function () {}, function () {}, {})
        navigator.geolocation.getCurrentPosition(pos => {
          const destCords = Number(pos.coords.latitude) + ',' + Number(pos.coords.longitude)
          this.nBranchForm.get('direccion').setValue(destCords)
        })
      } else {
        alert('Por favor activa la ubicación para esta función')
      }
    } else {
      this.nBranchForm.get('direccion').setValue('')
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
    this.nBranchForm.get('direccion').setValue(this.branchCords.nativeElement.value)
    this.gcords = false
  }

}
