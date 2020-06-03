import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {BranchService} from "../../../services/branch.service";
import {Branch} from "../../../models/branch";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
declare var $: any
@Component({
  selector: 'app-customer-branch-offices',
  templateUrl: './customer-branch-offices.component.html',
  styleUrls: ['./customer-branch-offices.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerBranchOfficesComponent implements OnInit {
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  bdtTrigger: Subject<any> = new Subject()
  bdtOptions
  myBranchOffices: Branch[]
  curUser: User
  edBranchForm: FormGroup
  exitMsg = ''
  errMsg = ''
  confMsg = ''
  places: []
  branchToDelete = null

  constructor(private branchService: BranchService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private http: HttpClient
  ) {
    this.curUser = this.authService.currentUserValue
  }

  ngOnInit(): void {
    this.edBranchForm = this.formBuilder.group(
      {
        idSucursal:[],
        nomSucursal: ['', Validators.required],
        numTelefono: ['', [Validators.minLength(9), Validators.maxLength(9)]],
        direccion: ['', Validators.required]
      }
    )
    this.bdtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order:[2,'desc'],
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
          previous: 'Ant.'
        },
      },
    }
    this.loadData()
  }

  loadData() {
    this.branchService.getBranchOffices().subscribe(response => {
      this.myBranchOffices = response.data
      this.bdtTrigger.next()
    })
  }

  showEditForm(id){
    let currBranch: Branch = {}
    this.myBranchOffices.forEach(value => {
      if(value.idSucursal === id){
        currBranch = value
      }
    })

    this.edBranchForm.get('idSucursal').setValue(currBranch.idSucursal)
    this.edBranchForm.get('nomSucursal').setValue(currBranch.nomSucursal)
    this.edBranchForm.get('numTelefono').setValue(currBranch.numTelefono)
    this.edBranchForm.get('direccion').setValue(currBranch.direccion)
    $("#edBranchModal").modal('show')
  }

  submitEditBranch() {
    if (this.edBranchForm.valid) {
      this.loaders.loadingSubmit = true
      this.branchService.editBranch(this.edBranchForm.value)
        .subscribe(response => {
            this.loaders.loadingSubmit = false
            this.exitMsg = response.message
            $("#succsModal").modal('show')
          },
          error => {
            error.subscribe(error => {
              this.loaders.loadingSubmit = false
              this.errMsg = error.statusText
              $("#errModal").modal('show')
            })
          })
    }
  }

  reloadData() {
    location.reload(true)
  }

  searchAddress(event) {
    let lugar = event.target.value
    this.http.post<any>(`${environment.apiUrl}`, {lugar: lugar, function: 'searchPlace'}).subscribe(response => {
      this.places = response
    })
  }

  setAddress(origin) {
    this.edBranchForm.get('direccion').setValue(origin)
    this.places = []
  }

  setCurrentLocation(event) {
    if (event.target.checked == true) {
      if (navigator) {
        navigator.geolocation.getCurrentPosition(function () {}, function () {}, {})
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

  showConfirmDelete(id){
    let currBranch: Branch = {}

    this.myBranchOffices.forEach(value => {
      if(value.idSucursal === id){
        currBranch = value
      }
    })
    this.branchToDelete = currBranch.idSucursal
   this.confMsg = '¿Estás seguro de eliminar la dirección '+ currBranch.nomSucursal +'?'
    $("#confirmModal").modal('show')
  }

  deleteBranch(){
    this.branchService.deleteBranch(this.branchToDelete).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.exitMsg = response.message
        $("#succsModal").modal('show')
      },
      error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.errMsg = error.statusText
          $("#errModal").modal('show')
        })
      })
  }

}
