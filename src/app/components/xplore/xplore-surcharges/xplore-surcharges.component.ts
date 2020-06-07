import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer} from "../../../models/customer";
import {SurchargesService} from "../../../services/surcharges.service";
import {UsersService} from "../../../services/users.service";
import {Surcharge} from "../../../models/surcharge";
declare var $: any

@Component({
  selector: 'app-xplore-surcharges',
  templateUrl: './xplore-surcharges.component.html',
  styleUrls: ['./xplore-surcharges.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreSurchargesComponent implements OnInit {
  dtOptions
  dtTrigger: Subject<any>
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  exitMsg = ''
  errMsg = ''
  edSurChForm: FormGroup
  newSurchForm: FormGroup

  customers: Customer[]
  surcharges: Surcharge[]
  constructor(
    private formBuilder: FormBuilder,
    private surchargesService: SurchargesService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  get f() {
    return this.edSurChForm.controls
  }

  get fNew() {
    return this.newSurchForm.controls
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.edSurChForm = this.formBuilder.group(
      {
        idRecargo: [],
        descRecargo:['', Validators.required],
        kilomMinimo: ['', Validators.required],
        kilomMaximo: ['', Validators.required],
        monto: ['', Validators.required],
        idCliente: [null, Validators.required]
      }
    )

    this.newSurchForm = this.formBuilder.group(
      {
        descRecargo:['', Validators.required],
        kilomMinimo: ['', Validators.required],
        kilomMaximo: ['', Validators.required],
        monto: ['', Validators.required],
        idCliente: [null, Validators.required]
      }
    )

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
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
  }

  loadData() {
    this.surchargesService.getSurcharges().subscribe(response => {
      this.surcharges = response.data
      this.dtTrigger.next()
    })

    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
    })
  }

  reloadData() {
    this.ngOnInit()
  }

  showEditForm(id) {
    let currSurcharge: Surcharge = {}
    this.surcharges.forEach(value => {
      if (value.idRecargo === id) {
        currSurcharge = value
      }
    })
    this.f.idRecargo.setValue(currSurcharge.idRecargo)
    this.f.descRecargo.setValue(currSurcharge.descRecargo)
    this.f.kilomMinimo.setValue(currSurcharge.kilomMinimo)
    this.f.kilomMaximo.setValue(currSurcharge.kilomMaximo)
    this.f.monto.setValue(currSurcharge.monto)
    this.f.idCliente.setValue(currSurcharge.idCliente)
    $("#edRecModal").modal('show')
  }

  showNewForm() {
    $("#newRecModal").modal('show')
  }

  onFormEditSubmit() {
    if (this.edSurChForm.valid) {
      this.loaders.loadingSubmit = true
      this.surchargesService.editSurcharge(this.edSurChForm.value)
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

  onFormNewSubmit() {
    if (this.newSurchForm.valid) {
      this.loaders.loadingSubmit = true
      this.surchargesService.createSurcharge(this.newSurchForm.value)
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

}
