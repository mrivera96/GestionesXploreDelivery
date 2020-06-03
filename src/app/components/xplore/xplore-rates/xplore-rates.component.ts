import {Component, OnInit} from '@angular/core';
import {Category} from "../../../models/category";
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../services/categories.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {RatesService} from "../../../services/rates.service";
import {Rate} from "../../../models/rate";
import {Branch} from "../../../models/branch";

declare var $: any

@Component({
  selector: 'app-xplore-rates',
  templateUrl: './xplore-rates.component.html',
  styleUrls: ['./xplore-rates.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreRatesComponent implements OnInit {

  dtOptions
  rates: Rate[]
  dtTrigger: Subject<any>
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  exitMsg = ''
  errMsg = ''
  edRateForm: FormGroup
  newRateForm: FormGroup
  categories: Category[]

  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder:FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  get f(){
    return this.edRateForm.controls
  }
  get fNew(){
    return this.newRateForm.controls
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.edRateForm = this.formBuilder.group(
      {
        idTarifaDelivery: [],
        idCategoria: [null, Validators.required],
        entregasMinimas: ['', Validators.required],
        entregasMaximas: ['', Validators.required],
        precio: ['', Validators.required],
      }
    )

    this.newRateForm = this.formBuilder.group(
      {
        idCategoria: [null, Validators.required],
        entregasMinimas: ['', Validators.required],
        entregasMaximas: ['', Validators.required],
        precio: ['', Validators.required],
      }
    )

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [1, 'desc'],
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
    this.ratesService.getRates().subscribe(response => {
      this.rates = response.data
      this.dtTrigger.next()
    })

    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
    })
  }

  reloadData() {
    this.ngOnInit()
  }

  showEditForm(id) {
    let currRate: Rate = {}
    this.rates.forEach(value => {
      if(value.idTarifaDelivery === id){
        currRate = value
      }
    })
    this.edRateForm.get('idTarifaDelivery').setValue(currRate.idTarifaDelivery)
    this.edRateForm.get('idCategoria').setValue(currRate.idCategoria)
    this.edRateForm.get('entregasMinimas').setValue(currRate.entregasMinimas)
    this.edRateForm.get('entregasMaximas').setValue(currRate.entregasMaximas)
    this.edRateForm.get('precio').setValue(currRate.precio)
    $("#edTarModal").modal('show')
  }

  showNewForm() {
    $("#newTarModal").modal('show')
  }

  onFormEditSubmit() {
    if (this.edRateForm.valid) {
      this.loaders.loadingSubmit = true
      this.ratesService.editRate(this.edRateForm.value)
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
    if (this.newRateForm.valid) {
      this.loaders.loadingSubmit = true
      this.ratesService.createRate(this.newRateForm.value)
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
