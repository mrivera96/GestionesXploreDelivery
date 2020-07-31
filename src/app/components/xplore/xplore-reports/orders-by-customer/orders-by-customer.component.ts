import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {Customer} from "../../../../models/customer";
import {UsersService} from "../../../../services/users.service";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {DatePipe, formatDate} from "@angular/common";
import {OrdersByCategory} from "../../../../models/orders-by-category";
import {DeliveryDetail} from "../../../../models/delivery-detail";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
@Component({
  selector: 'app-orders-by-cutomer',
  templateUrl: './orders-by-customer.component.html',
  styleUrls: ['./orders-by-customer.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class OrdersByCustomerComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective
  @ViewChild('TABLE', {static: false})
  TABLE: ElementRef;
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
  }
  consultForm: FormGroup
  customers: Customer[]
  dtOptions: any
  dtOptions1: any
  dtTrigger: Subject<any>
  dtTrigger1: Subject<any>
  consultResults: any
  totalOrders: number
  filteredCustomers: Customer[]
  currenCustomer: Customer
  totalCustomerOrders: number = 0
  ordersByCategory: OrdersByCategory[]
  totalSurcharges: number
  totalCosts: number
  orders: DeliveryDetail[]
  totalCostsF: string
  totalSurchF: string

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
    this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data
      this.filteredCustomers = response.data
    })
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.dtTrigger1 = new Subject<any>()
    this.consultForm = this.formBuilder.group({
      customerId: ['', [Validators.required]],
      initDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })

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

    this.dtOptions1 = {
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

  get f() {
    return this.consultForm.controls
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.loaders.loadingSubmit = true
      this.totalOrders = 0.00
      this.totalSurcharges = 0.00
      this.totalCosts = 0.00
      this.deliveriesService.getOrdersByCustomer(this.consultForm.value).subscribe(response => {
        this.consultResults = response.data.ordersReport

        this.consultResults.forEach(value => {
          this.totalOrders = this.totalOrders + +value.orders
        })

        this.totalCustomerOrders = response.data?.totalOrders
        this.ordersByCategory = response.data?.ordersByCategory

        this.orders = response.data.orders
        this.ordersByCategory.forEach(value => {
          this.totalSurcharges = this.totalSurcharges + +value.totalSurcharges
          this.totalCosts = this.totalCosts + +value.cTotal
        })

        this.totalCostsF = this.totalCosts.toFixed(2)
        this.totalSurchF = this.totalSurcharges.toFixed(2)

        this.setResume()

        if (this.datatableElement.dtInstance) {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
              this.dtTrigger1.next()
            })
        } else {
          this.dtTrigger.next()
          this.dtTrigger1.next()
        }

        this.loaders.loadingSubmit = false
      })
    }
  }

  onKey(value) {
    this.filteredCustomers = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    if (filter != "") {
      return this.customers.filter(option => option.nomEmpresa.toLowerCase().includes(filter));
    }
    return this.customers
  }

  setResume() {
    this.customers.forEach(value => {
      if (value.idCliente == this.f.customerId.value) {
        this.currenCustomer = value
      }
    })
  }


  generateExcel() {

    //Excel Title, Header, Data
    const title = 'Reporte de envíos - '+this.currenCustomer.nomEmpresa;
    const header = ["Year", "Month", "Make", "Model", "Quantity", "Pct"]

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Envíos');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Arial', family: 4, size: 16, underline: 'double', bold: true}
    worksheet.addRow([]);
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Desde : ' + this.f.initDate.value+' Hasta: '+this.f.finDate.value])
    let totalOrders = worksheet.addRow(['Envíos Totales : ' + this.totalCustomerOrders])
    worksheet.mergeCells('A1:D2');
    worksheet.mergeCells('A3:C3');
    worksheet.mergeCells('A4:B4');
    //Blank Row
    worksheet.addRow([]);
    //Add Header Row
    worksheet.addRow(['Envíos por categoría']);
    worksheet.addRow([]);
    const ordersByCategoryHeader = ["N°", "Categoría", "Envíos Realizados", "Recargos", "Costos Totales"]
    let ordersByCategoryheaderRow = worksheet.addRow(ordersByCategoryHeader);

    // Cell Style : Fill and Border
    ordersByCategoryheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'D3D3D3'},
        bgColor: {argb: 'D3D3D3'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    let arrayRow = []
    let index = 1
    this.ordersByCategory.forEach(d => {
      let array = [index,d.category,d.orders,'L.'+d.totalSurcharges,'L.'+d.cTotal]
      arrayRow.push(array)
      index ++
    })
    arrayRow.forEach(v => {
      let row = worksheet.addRow(v);
    })

    worksheet.addRow(['','Total:',this.totalOrders,'L.'+this.totalSurchF,'L.'+this.totalCostsF]);

    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.addRow([]);

    //Add Header Row
    worksheet.addRow(['Envíos por fecha']);

    worksheet.addRow([]);
    const ordersByDateHeader = ["Cliente", "fecha", "Envíos Realizados"]
    let ordersByDateheaderRow = worksheet.addRow(ordersByDateHeader);

    // Cell Style : Fill and Border
    ordersByDateheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'D3D3D3'},
        bgColor: {argb: 'D3D3D3'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    let array1Row = []
    this.consultResults.forEach(d => {
      let array = [d.customer,d.fecha,d.orders]
      array1Row.push(array)
      index ++
    })
    array1Row.forEach(v => {
      let row = worksheet.addRow(v);
    })
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, 'Reporte envíos ('+this.currenCustomer.nomEmpresa+').xlsx');
    })
  }


}
