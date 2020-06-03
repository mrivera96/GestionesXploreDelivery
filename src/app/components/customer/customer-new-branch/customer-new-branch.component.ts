import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {animate, style, transition, trigger} from "@angular/animations";
import {BranchService} from "../../../services/branch.service";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

declare var $: any

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

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.nBranchForm = this.formBuilder.group(
      {
        nomSucursal: ['', Validators.required],
        numTelefono: ['', [Validators.minLength(9), Validators.maxLength(9)]],
        direccion: ['', Validators.required]
      }
    )
  }

  onSubmitForm() {
    if (this.nBranchForm.valid) {
      this.loaders.loadingSubmit = true
      this.branchService.newBranch(this.nBranchForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.succsMsg = response.message
        $("#succsModal").modal('show')
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.errorMsg = error.statusText
          $("#errModal").modal('show')
        })
      })
    }
  }

  reloadPage() {
    this.ngOnInit()
  }

  cleanForm() {
    this.nBranchForm.reset()
  }

  searchAddress(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiUrl}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
      this.places = response
    })
  }

  setAddress(origin) {
    this.nBranchForm.get('direccion').setValue(origin)
    this.places = []
  }

  setCurrentLocation(event) {
    if (event.target.checked == true) {
      if (navigator) {
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

}
