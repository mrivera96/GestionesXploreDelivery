import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {CategoriesService} from "../../../services/categories.service";
import {Category} from "../../../models/category";
import {Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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

  constructor(
    private categoriesService: CategoriesService
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.edCatForm = new FormGroup(
      {
        idTipoVehiculo: new FormControl(),
        //descTipoVehiculo: new FormControl('', Validators.required),
        delivery: new FormControl(0, Validators.required)
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
    id = id - 1
    const currCat = this.categories[id]
    //this.edCatForm.get('descTipoVehiculo').setValue(currCat.descTipoVehiculo)
    this.edCatForm.get('delivery').setValue(currCat.delivery)
    this.edCatForm.get('idTipoVehiculo').setValue(currCat.idTipoVehiculo)
    $("#edCatModal").modal('show')
  }

  submitEditCat() {
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

}
