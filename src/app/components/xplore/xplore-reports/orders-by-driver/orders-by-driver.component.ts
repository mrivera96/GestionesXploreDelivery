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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Cell, Columns, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper'
import * as html2pdf from 'html2pdf.js'

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
  totals: any = {
    motoOrders: 0,
    motoTime: 0,
    motoOver20kms: 0,
    turismoOrders: 0,
    turismoTime: 0,
    turismoOver20kms: 0,
    pickupOrders: 0,
    pickupTime: 0,
    pickupOver20kms: 0,
    panelOrders: 0,
    panelTime: 0,
    panelOver20kms: 0,
    pickupAuxiliarOrders: 0,
    pickupAuxiliarTime: 0,
    pickupAuxiliarOver20kms: 0,
    panelAuxiliarOrders: 0,
    panelAuxiliarTime: 0,
    panelAuxiliarOver20kms: 0,
    totalOrders: 0,
    totalTime: 0,
    totalMoney: 0,
    totalOver20kms: 0
  }

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
      order: [0, 'asc'],
      responsive: false,
      language: {
        emptyTable: 'No hay datos para mostrar en esta tabla',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        print: "imprimir",
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

        this.consultResults.forEach(result => {
          this.totals.motoOrders = this.totals.motoOrders + +result.moto
          this.totals.motoTime = this.totals.motoTime + +result.motoTime
          this.totals.motoOver20kms = this.totals.motoOver20kms + +result.motoOver20kms
          this.totals.turismoOrders = this.totals.turismoOrders + +result.turismo
          this.totals.turismoTime = this.totals.turismoTime + +result.turismoTime
          this.totals.turismoOver20kms = this.totals.turismoOver20kms + +result.turismoOver20kms
          this.totals.pickupOrders = this.totals.pickupOrders + +result.pickup
          this.totals.pickupTime = this.totals.pickupTime + +result.pickupTime
          this.totals.pickupOver20kms = this.totals.pickupOver20kms + +result.pickupOver20kms
          this.totals.panelOrders = this.totals.panelOrders + +result.panel
          this.totals.panelTime = this.totals.panelTime + +result.panelTime
          this.totals.panelOver20kms = this.totals.panelOver20kms + +result.panelOver20kms
          this.totals.pickupAuxiliarOrders = this.totals.pickupAuxiliarOrders + +result.pickupAuxiliar
          this.totals.pickupAuxiliarTime = this.totals.pickupAuxiliarTime + +result.pickupAuxiliarTime
          this.totals.pickupAuxiliarOver20kms = this.totals.pickupAuxiliarOver20kms + +result.pickupAuxiliarOver20kms
          this.totals.panelAuxiliarOrders = this.totals.panelAuxiliarOrders + +result.panelAuxiliar
          this.totals.panelAuxiliarTime = this.totals.panelAuxiliarTime + +result.panelAuxiliarTime
          this.totals.panelAuxiliarOver20kms = this.totals.panelAuxiliarOver20kms + +result.panelAuxiliarOver20kms
          this.totals.totalOrders = this.totals.totalOrders + +result.totalOrders
          this.totals.totalTime = this.totals.totalTime + +result.totalTime
          this.totals.totalMoney = this.totals.totalMoney + +result.totalMoney
          this.totals.totalOver20kms = this.totals.totalOver20kms + +result.totalOver20kms
        })

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
    let title = ''
    if (currentDriver.nomUsuario) {
      title = 'Reporte de envíos - ' + currentDriver.nomUsuario
    } else {
      title = 'Reporte de envíos - Todos los conductores'
    }


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
      "",
      "Turismo",
      "",
      "",
      "Pick-Up",
      "",
      "",
      "Panel",
      "",
      "",
      "Pick-Up + Auxiliar",
      "",
      "",
      "Panel + Auxiliar",
      "",
      "",
      "Totales",
      "",
      "",
      ""
    ]

    let categoriesheaderRow = worksheet.addRow(categoriesHeader);

    worksheet.mergeCells('A8:B8');
    worksheet.mergeCells('C8:E8');
    worksheet.mergeCells('F8:H8');
    worksheet.mergeCells('I8:K8');
    worksheet.mergeCells('L8:N8');
    worksheet.mergeCells('O8:Q8');
    worksheet.mergeCells('R8:T8');
    worksheet.mergeCells('U8:X8');

    categoriesheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = {
        horizontal: "center"
      }
    })

    const ordersByDateHeader = [
      "Conductor",
      "Fecha",
      "Entregas",
      "Tiempo",
      "Tiempo > 20kms",
      "Entregas",
      "Tiempo",
      "Tiempo > 20kms",
      "Entregas",
      "Tiempo",
      "Tiempo > 20kms",
      "Entregas",
      "Tiempo",
      "Tiempo > 20kms",
      "Entregas",
      "Tiempo",
      "Tiempo > 20kms",
      "Entregas",
      "Tiempo",
      "Tiempo > 20kms",
      "Entregas Realizadas",
      "Tiempo de Entregas",
      "Tiempo > 20kms",
      "Efectivo Recibido",
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
        d.motoOver20kms,
        d.turismo,
        d.turismoTime,
        d.turismoOver20kms,
        d.pickup,
        d.pickupTime,
        d.pickupOver20kms,
        d.panel,
        d.panelTime,
        d.panelOver20kms,
        d.pickupAuxiliar,
        d.pickupAuxiliarTime,
        d.pickupAuxiliarOver20kms,
        d.panelAuxiliar,
        d.panelAuxiliarTime,
        d.panelAuxiliarOver20kms,
        d.totalOrders,
        d.totalTime,
        d.totalOver20kms,
        d.totalMoney
      ]
      array1Row.push(array)
    })

    array1Row.forEach(v => {
      worksheet.addRow(v);
    })

    let arrayFooterRow = [
      "",
      "Subtotal:",
      this.totals.motoOrders,
      this.totals.motoTime,
      this.totals.motoOver20kms,
      this.totals.turismoOrders,
      this.totals.turismoTime,
      this.totals.turismoOver20kms,
      this.totals.pickupOrders,
      this.totals.pickupTime,
      this.totals.pickupOver20kms,
      this.totals.panelOrders,
      this.totals.panelTime,
      this.totals.panelOver20kms,
      this.totals.pickupAuxiliarOrders,
      this.totals.pickupAuxiliarTime,
      this.totals.pickupAuxiliarOver20kms,
      this.totals.panelAuxiliarOrders,
      this.totals.panelAuxiliarTime,
      this.totals.panelAuxiliarOver20kms,
      this.totals.totalOrders,
      this.totals.totalTime,
      this.totals.totalOver20kms,
      this.totals.totalMoney
    ]

    worksheet.addRow(arrayFooterRow);

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
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 20;
    worksheet.getColumn(22).width = 20;
    worksheet.getColumn(23).width = 20;
    worksheet.getColumn(24).width = 20;
    worksheet.getColumn(25).width = 20;


    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (currentDriver.nomUsuario) {
        fs.saveAs(blob, 'Reporte envíos por conductor (' + currentDriver.nomUsuario + ').xlsx');
      } else {
        fs.saveAs(blob, 'Reporte envíos por conductor (todos).xlsx');
      }
    })
  }

  printReport() {
    let divToPrint = document.getElementById('printTable')
    const newWin = window.open('', '_blank', 'width=1366,height=760,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no')
    newWin.document.open();
    newWin.document.write(divToPrint.outerHTML)
    newWin.print()
    newWin.document.close()
  }

  generatePDF() {
    let currentDriver: User = {}
    let fname = ''

    this.drivers.forEach(driver => {
      if (driver.idUsuario == this.f.driverId.value) {
        currentDriver = driver
      }
    })

    if (currentDriver.nomUsuario) {
      fname = 'Reporte envíos por conductor (' + currentDriver.nomUsuario + ').pdf'
    } else {
      fname = 'Reporte envíos por conductor (todos).pdf'
    }

    const pdf = new PdfMakeWrapper()

    let title = ''
    if (currentDriver.nomUsuario) {
      title = 'Reporte de envíos - ' + currentDriver.nomUsuario
    } else {
      title = 'Reporte de envíos - Todos los conductores'
    }

    pdf.pageSize('tabloid')
    pdf.pageOrientation('landscape')

  

    pdf.add(
      new Txt(title).bold().end
    )
    pdf.add(
      pdf.ln(2)
    )
    pdf.add(
      new Txt('Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value).italics().end
    )
    pdf.add(
      pdf.ln(2)
    )

    const header = [
      [

      ],
      [

      ],
      [
        new Cell(new Txt('Moto').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Turismo').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Pick-Up').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Panel').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
      [
        new Txt('').bold().end,
        new Cell(new Txt('PickUp + Auxiliar').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Panel + Auxiliar').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Totales').bold().end).colSpan(3).end,
      ],
      [

      ],
      [

      ],
    ]

    const subHeader = [
      "Conductor",
      "Fecha",
      "Entregas",
      "Tiempo",
      "Efectivo",
      "Entregas",
      "Tiempo",
      "Efectivo",
      "Entregas",
      "Tiempo",
      "Efectivo",
      "Entregas",
      "Tiempo",
      "Efectivo",
      "Entregas",
      "Tiempo",
      "Efectivo",
      "Entregas",
      "Tiempo",
      "Efectivo",
      "Entregas Realizadas",
      "Tiempo de Entregas",
      "Efectivo Recibido"
    ]

    let body = [
      
    ]

    let array1Row = []
    this.consultResults.forEach(d => {
      let array = [
        d.driver,
        d.fecha,
        d.moto,
        d.motoTime,
        d.motoMoney,
        d.turismo,
        d.turismoTime,
        d.turismoMoney,
        d.pickup,
        d.pickupTime,
        d.pickupMoney,
        d.panel,
        d.panelTime,
        d.panelMoney,
        d.pickupAuxiliar,
        d.pickupAuxiliarTime,
        d.pickupAuxiliarMoney,
        d.panelAuxiliar,
        d.panelAuxiliarTime,
        d.panelAuxiliarMoney,
        d.totalOrders,
        d.totalTime,
        d.totalMoney
      ]
      array1Row.push(array)
    })

    array1Row.forEach(res => {
      body.push(res)
    })

    let fArray = []
    fArray.push(body)

    pdf.add(
      new Table([
        header,
        subHeader,
        fArray
      ]
      ).end
    )
  

    console.log(array1Row)
    pdf.create().open()


  }

}
