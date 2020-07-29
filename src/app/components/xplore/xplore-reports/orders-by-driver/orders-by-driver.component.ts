import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {formatDate} from "@angular/common";
import {UsersService} from "../../../../services/users.service";
import {User} from "../../../../models/user";
import {ReportOrdersByDriver} from "../../../../models/report-orders-by-driver";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";

@Component({
  selector: 'app-orders-by-driver',
  templateUrl: './orders-by-driver.component.html',
  styleUrls: ['./orders-by-driver.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class OrdersByDriverComponent implements OnInit {
  @ViewChild(DataTableDirective,{static:false})
  datatableElement:DataTableDirective
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
  }
  consultForm: FormGroup
  drivers: User[]
  filteredDrivers: User[]
  consultResults: ReportOrdersByDriver[]
  dtOptions: any
  dtTrigger: Subject<any>
  totalOrders: number
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private deliveriesService: DeliveriesService
  ) {
  }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }

  loadData() {
    this.usersService.getDrivers().subscribe(response => {
      this.drivers = response.data
      this.filteredDrivers = response.data
    })
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.consultForm = this.formBuilder.group({
      driverId: ['', [Validators.required]],
      initDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: false,
      processing: true,
      info: true,
      dom: 'Bfrtip',
      buttons: [
        { extend: 'copy', footer: true},
        {extend: 'print', footer: true},
        {extend: 'csv', footer: true},
        {extend: 'excel', footer: true}
      ],
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

  get f() {
    return this.consultForm.controls
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.loaders.loadingSubmit = true
      this.totalOrders = 0
      this.deliveriesService.getOrdersByDriver(this.consultForm.value).subscribe(response => {
        this.consultResults = response.data
        this.consultResults.forEach(value => {
          this.totalOrders = +this.totalOrders + +value.orders
        })

        if(this.datatableElement.dtInstance){
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
            })
        }else{
          this.dtTrigger.next()
        }

        this.loaders.loadingSubmit = false
      })
    }
  }

  onKey(value) {
    this.filteredDrivers = this.search(value) ;
  }

  search(value: string) {
    let filter = value.toLowerCase();
    if(filter != ""){
      return  this.drivers.filter(option => option.nomUsuario.toLowerCase().includes(filter));
    }
    return this.drivers
  }

}
