import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {CategoriesService} from "../../../services/categories.service";
import {Category} from "../../../models/category";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Branch} from "../../../models/branch";

declare var $: any;

@Component({
  selector: 'app-xplore-categories',
  templateUrl: './xplore-categories.component.html',
  styleUrls: ['./xplore-categories.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreCategoriesComponent implements OnInit {
  dtOptions
  categories: Category[]
  dtTrigger: Subject<any>
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  exitMsg = ''
  errMsg = ''
  edCatForm: FormGroup
  newCatForm: FormGroup

  constructor(
    private categoriesService: CategoriesService
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  get f() {
    return this.edCatForm.controls
  }

  get fNew(){
    return this.newCatForm.controls
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.edCatForm = new FormGroup(
      {
        idCategoria: new FormControl(),
        descCategoria: new FormControl(0, Validators.required),
        isActivo: new FormControl(0, Validators.required)
      }
    )

    this.newCatForm = new FormGroup(
      {
        descCategoria: new FormControl(null, Validators.required)
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
    this.categoriesService.showAllCategories().subscribe(response => {
      this.categories = response.data
      this.dtTrigger.next()
    })
  }

  reloadData() {
    this.ngOnInit()
  }

  showEditForm(id) {
    let currCat: Category = {}
    this.categories.forEach(value => {
      if (value.idCategoria == id) {
        currCat = value
      }
    })
    this.f.idCategoria.setValue(currCat.idCategoria)
    this.f.descCategoria.setValue(currCat.descCategoria)
    this.f.isActivo.setValue(currCat.isActivo)
    $("#edCatModal").modal('show')
  }

  showNewCatForm(){
    $("#newCatModal").modal('show')
  }

  onFormEditSubmit() {
    if (this.edCatForm.valid) {
      this.loaders.loadingSubmit = true
      this.categoriesService.editCategory(this.edCatForm.value)
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
    if (this.newCatForm.valid) {
      this.loaders.loadingSubmit = true
      this.categoriesService.createCategory(this.newCatForm.value)
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
