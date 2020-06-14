import {Component, OnInit} from '@angular/core';
import {Category} from "../../../models/category";
import {Subject} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../../services/categories.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {RatesService} from "../../../services/rates.service";
import {Rate} from "../../../models/rate";
import {Customer} from "../../../models/customer";
import {UsersService} from "../../../services/users.service";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {EditRateDialogComponent} from "./edit-rate-dialog/edit-rate-dialog.component";
import {NewRateDialogComponent} from "./new-rate-dialog/new-rate-dialog.component";

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

  categories: Category[]
  customers: Customer[]

  constructor(
    private ratesService: RatesService,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [2, 'desc'],
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
    this.loaders.loadingData = true
  }

  loadData() {
    this.ratesService.getRates().subscribe(response => {
      this.rates = response.data
      this.loaders.loadingData = false
      this.dtTrigger.next()
    })

    this.categoriesService.getAllCategories().subscribe(response => {
      this.categories = response.data
    })

    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
    })
  }

  reloadData() {
    this.ngOnInit()
  }

  showEditForm(id) {
    let currRate: Rate = {}
    this.rates.forEach(value => {
      if (value.idTarifaDelivery === id) {
        currRate = value
      }
    })
    this.openEditDialog(currRate)
  }

  showNewForm() {
     this.dialog.open(NewRateDialogComponent)

    /*dialog.afterClosed().subscribe(result => {
      this.reloadData()
    })*/
  }

  openEditDialog(currRate): void {
     this.dialog.open(EditRateDialogComponent, {
      data: {
        rate: currRate
      }
    })
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if(reload){
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = true
        this.reloadData()
      })
    }

  }

}
