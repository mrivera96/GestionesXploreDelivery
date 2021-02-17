import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { formatDate } from "@angular/common";
import { UsersService } from "../../../../services/users.service";
import { User } from "../../../../models/user";
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
import { Cell, Columns, PdfMakeWrapper, Txt } from 'pdfmake-wrapper'
import { ErrorModalComponent } from "../../../shared/error-modal/error-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { ConsolidatedReportResult } from 'src/app/models/consolidated-report-result';
@Component({
  selector: 'app-orders-by-driver-consolidated',
  templateUrl: './orders-by-driver-consolidated.component.html',
  styleUrls: ['./orders-by-driver-consolidated.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class OrdersByDriverConsolidatedComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
  }
  consultForm: FormGroup
  drivers: User[]
  filteredDrivers: User[]
  consultResults: ConsolidatedReportResult[] = []
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
    totalOrders: 0,
    totalTime: 0,
    totalMoney: 0,
  }
  dates: any[] = []

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private deliveriesService: DeliveriesService,
    public dialog: MatDialog,
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
    //this.dtTrigger = new Subject<any>()
    this.consultForm = this.formBuilder.group({
      driverId: ['', [Validators.required]],
      initDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })

    /*this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,

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
    }*/

  }

  get f() {
    return this.consultForm.controls
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.loaders.loadingSubmit = true
      this.dates = []
      this.consultResults = []
      this.totalOrders = 0
      this.totals = {
        totalOrders: 0,
        totalTime: 0,
        totalMoney: 0,
      }
      const initDate = new Date(this.consultForm.get('initDate').value.split('-'))
    
      this.dates.push(this.consultForm.get('initDate').value)
      this.dates[1] = formatDate(new Date().setDate(initDate.getDate() + 1), 'yyyy-MM-dd', 'en') 
      this.dates[2] = formatDate(new Date().setDate(initDate.getDate() + 2), 'yyyy-MM-dd', 'en') 
      this.dates[3] = formatDate(new Date().setDate(initDate.getDate() + 3), 'yyyy-MM-dd', 'en') 
      this.dates[4] = formatDate(new Date().setDate(initDate.getDate() + 4), 'yyyy-MM-dd', 'en') 
      this.dates[5] = formatDate(new Date().setDate(initDate.getDate() + 5), 'yyyy-MM-dd', 'en') 
      this.dates.push(this.consultForm.get('finDate').value)
      this.deliveriesService.getConsolidatedOrdersByDriver(this.consultForm.value).subscribe(response => {
        this.consultResults = response.data

        this.consultResults.forEach(result => {
          result.totalOrders = 0
          result.totalTime = 0
          result.totalMoney = 0
          result.orders.forEach(objct => {
            result.totalOrders = result.totalOrders + +objct.totalOrders
            result.totalMoney = result.totalMoney + +objct.totalMoney
            result.totalTime = result.totalTime + +objct.tiempototal  
          })

        })

        /*if (this.datatableElement.dtInstance) {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
            })
        } else {
          this.dtTrigger.next()
        }*/

        this.loaders.loadingSubmit = false
      }, error => {
        if (error.subscribe()) {
          error.subscribe(error => {
            this.loaders.loadingSubmit = false
            this.openErrorDialog(error.statusText)
          })
        } else {
          this.loaders.loadingSubmit = false
          this.openErrorDialog(error.statusText)
        }

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

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

  }

  generateExcel() {
    /*let currentDriver: User = {}

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
      "Transporte Turismo",
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
      "Camión 11 pies",
      "",
      "Totales",
      "",
      "",
      "",
      "",
      "",
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
    worksheet.mergeCells('Q8:R8');
    worksheet.mergeCells('S8:Y8');

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
      "Entregas",
      "Tiempo",
      "Tiempo Auxiliar",
      "Entregas",
      "Subtotal Tiempo",
      "Tiempo > 20kms",
      "Tiempo Extra",
      "Tiempo Total",
      "Efectivo",
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
        d.transTurism,
        d.transTurismTime,
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
        d.camion11,
        d.camion11Time,
        d.totalAuxTime,
        d.totalOrders,
        d.totalTime,
        d.totalOver20kms,
        d.totalExtraTime,
        d.tiempototal,
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
      this.totals.transTurismOrders,
      this.totals.transTurismTime,
      this.totals.motoOrders,
      this.totals.motoTime,
      this.totals.turismoOrders,
      this.totals.turismoTime,
      this.totals.pickupOrders,
      this.totals.pickupTime,
      this.totals.panelOrders,
      this.totals.panelTime,
      this.totals.pickupAuxiliarOrders,
      this.totals.pickupAuxiliarTime,
      this.totals.panelAuxiliarOrders,
      this.totals.panelAuxiliarTime,
      this.totals.camion11Orders,
      this.totals.camion11Time,
      this.totals.totalAuxTime,
      this.totals.totalOrders,
      this.totals.totalTime,
      this.totals.totalOver20kms,
      this.totals.totalExtraTime,
      this.totals.tiempoTotal,
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
    worksheet.getColumn(26).width = 20;


    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (currentDriver.nomUsuario) {
        fs.saveAs(blob, 'Reporte envíos por conductor (' + currentDriver.nomUsuario + ').xlsx');
      } else {
        fs.saveAs(blob, 'Reporte envíos por conductor (todos).xlsx');
      }
    })*/
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
    /*let currentDriver: User = {}

    this.drivers.forEach(driver => {
      if (driver.idUsuario == this.f.driverId.value) {
        currentDriver = driver
      }
    })

    const pdf = new PdfMakeWrapper()

    let title = ''
    if (currentDriver.nomUsuario) {
      title = 'Reporte de envíos - ' + currentDriver.nomUsuario
    } else {
      title = 'Reporte de envíos - Todos los conductores'
    }

    pdf.pageSize('A2')
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
      [],
      [],
      [
        new Cell(new Txt('Transporte Turismo').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Cell(new Txt('Moto').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Turismo').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Pick-Up').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Panel').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('PickUp + Auxiliar').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Panel + Auxiliar').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Camión 11 pies').bold().end).colSpan(2).end,
      ],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Totales').bold().end).colSpan(6).end,
      ],
      [],
      [],
      [],
      [],
      [],
      [],
    ]

    pdf.add(
      new Columns(header).alignment("center").end
    )

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
      "Entregas",
      "Tiempo",
      "Entregas",
      "Tiempo",
      "Tiempo Auxiliar",
      "Entregas",
      "Subtotal Tiempo",
      "Tiempo > 20kms",
      "Tiempo Extra",
      "Tiempo Total",
      "Efectivo",
    ]

    pdf.add(
      new Columns(ordersByDateHeader).alignment("center").bold().end
    )

    let array1Row = []
    this.consultResults.forEach(d => {
      let array = [
        d.driver,
        d.fecha,
        d.transTurism,
        d.transTurismTime,
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
        d.camion11,
        d.camion11Time,
        d.totalAuxTime,
        d.totalOrders,
        d.totalTime,
        d.totalOver20kms,
        d.totalExtraTime,
        d.tiempototal,
        d.totalMoney
      ]
      array1Row.push(array)
    })

    array1Row.forEach(res => {
      pdf.add(
        new Columns(res
        ).alignment("center").end
      )
    })

    let arrayFooterRow = [
      "",
      "Subtotal:",
      this.totals.transTurismOrders,
      this.totals.transTurismTime,
      this.totals.motoOrders,
      this.totals.motoTime,
      this.totals.turismoOrders,
      this.totals.turismoTime,
      this.totals.pickupOrders,
      this.totals.pickupTime,
      this.totals.panelOrders,
      this.totals.panelTime,
      this.totals.pickupAuxiliarOrders,
      this.totals.pickupAuxiliarTime,
      this.totals.panelAuxiliarOrders,
      this.totals.panelAuxiliarTime,
      this.totals.camion11Orders,
      this.totals.camion11Time,
      this.totals.totalAuxTime,
      this.totals.totalOrders,
      this.totals.totalTime,
      this.totals.totalOver20kms,
      this.totals.totalExtraTime,
      this.totals.tiempoTotal,
      this.totals.totalMoney
    ]

    pdf.add(
      new Columns(arrayFooterRow).bold().alignment("center").end
    )

    pdf.create().open()*/
  }
}