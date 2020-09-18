import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { UsersService } from "../../../../services/users.service";
import { User } from "../../../../models/user";
import { ReportOrdersByDriver } from "../../../../models/report-orders-by-driver";
import { DeliveriesService } from "../../../../services/deliveries.service";
import { animate, style, transition, trigger } from "@angular/animations";
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { OrdersByCategory } from "../../../../models/orders-by-category";
import { Order } from "../../../../models/order";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-orders-by-driver',
  templateUrl: './orders-by-driver.component.html',
  styleUrls: ['./orders-by-driver.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class OrdersByDriverComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
  }
  consultForm: FormGroup
  drivers: User[]
  filteredDrivers: User[]
  consultResults: any[] = []
  dtOptions: any
  dtTrigger: Subject<any>
  totalOrders: number
  ordersByCategory: OrdersByCategory[]
  totalSurcharges: number = 0
  totalCosts: number = 0
  totalExtracharges: number = 0
  ordersInRange: number = 0
  orders: Order[] = []

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
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      dom: 'Bfrtip',
      buttons: [
         'print'
      ],
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
        print:"imprimir",
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

        if (this.datatableElement.dtInstance) {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
            })
        } else {
          this.dtTrigger.next()
        }

        this.loaders.loadingSubmit = false
      })
    }
  }

  onKey(value) {
    this.filteredDrivers = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    if (filter != "") {
      return this.drivers.filter(option => option.nomUsuario.toLowerCase().includes(filter));
    }
    return this.drivers
  }

  generateExcel() {
    let currentDriver: User = {}

    this.drivers.forEach(driver => {
      if (driver.idUsuario == this.f.driverId.value) {
        currentDriver = driver
      }
    })

    //Excel Title, Header, Data
    const title = 'Reporte de envíos - ' + currentDriver.nomUsuario

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Envíos');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.mergeCells('A1:B2');
    worksheet.addRow([]);
    //Blank Row

    let subTitleRow = worksheet.addRow(['Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value])
    worksheet.mergeCells('A4:B4');
    subTitleRow.font = { name: 'Arial', family: 4, size: 12, bold: true }

    worksheet.addRow([]);
    //Add Header Row

    //Add Header Row
    const rangeTitle = worksheet.addRow(['Envíos por fecha']);
    rangeTitle.font = { name: 'Arial', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    const categoriesHeader = [
      "",
      "",
      "Moto",
      "",
      "Turismo",
      "",
      "Pick-Up",
      "",
      "Panel",
      "",
      "Pick-Up + Auxiliar",
      "",
      "Panel + Auxiliar",
      "",
      "Totales",
      ""
    ]

    let categoriesheaderRow = worksheet.addRow(categoriesHeader);

    worksheet.mergeCells('A8:B8');
    worksheet.mergeCells('C8:D8');
    worksheet.mergeCells('E8:F8');
    worksheet.mergeCells('G8:H8');
    worksheet.mergeCells('I8:J8');
    worksheet.mergeCells('K8:L8');
    worksheet.mergeCells('M8:N8');
    worksheet.mergeCells('O8:P8');

    categoriesheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    const ordersByDateHeader = [
      "Conductor",
      "Fecha",
      "Entregas",
      "Tiempo",
      "Entregas",
      "Tiempo",
      "Entregas",
      "Tiempo",
      "Entregas",
      "Tiempo",
      "Entregas",
      "Tiempo",
      "Entregas",
      "Tiempo",
      "Entregas Realizadas",
      "Tiempo de Entregas",
    ]
    let ordersByDateheaderRow = worksheet.addRow(ordersByDateHeader);

    // Cell Style : Fill and Border
    ordersByDateheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    let array1Row = []

    this.consultResults.forEach(d => {
      let array = [
        d.driver,
        d.fecha,
        d.moto,
        d.motoTime,
        d.turismo,
        d.turismoTime,
        d.pickup,
        d.pickupTime,
        d.panel,
        d.panelTime,
        d.pickupAuxiliar,
        d.pickupAuxiliarTime,
        d.panelAuxiliar,
        d.panelAuxiliarTime,
        d.totalOrders,
        d.totalTime
      ]
      array1Row.push(array)
    })

    array1Row.forEach(v => {
      worksheet.addRow(v);
    })

    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;


    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Reporte envíos por conductor (' + currentDriver.nomUsuario + ').xlsx');
    })
  }

  printReport(){
    let divToPrint = document.getElementById('printTable')
    const newWin = window.open('', '_blank', 'width=1366,height=760,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no')
    newWin.document.open();
    newWin.document.write(divToPrint.outerHTML)
    newWin.print()
    newWin.document.close()
  }

}
