import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {LoadingDialogComponent} from "../../../../../components/shared/loading-dialog/loading-dialog.component";
import {BillingService} from "../../../../../services/billing.service";
import {Workbook} from "exceljs";
import * as fs from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {formatDate} from "@angular/common";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-billing-report',
  templateUrl: './billing-report.component.html',
  styleUrls: ['./billing-report.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class BillingReportComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  dtTrigger: Subject<any> = new Subject()
  results = []
  dtOptions: any
  consultForm: FormGroup

  constructor(public dialog: MatDialog,
              private billingService: BillingService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
      autoWidth: true,
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

    this.consultForm = this.formBuilder.group({
      initDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })

  }

  onConsultFormSubmit(): void {
    if (this.consultForm.valid) {

      this.openLoader()
      const billingSubsc = this.billingService
        .getBillingReport(this.consultForm.value)
        .subscribe(response => {

          if (this.dtElement.dtInstance) {
            this.results = []
            this.results = response.data
            this.dtElement.dtInstance.then(
              (dtInstance: DataTables.Api) => {
                dtInstance.destroy()
                this.dtTrigger.next()
              })
          } else {
            this.results = response.data
            this.dtTrigger.next()
          }

          this.dialog.closeAll()

          billingSubsc.unsubscribe()
        }, error => {
          this.dialog.closeAll()
          billingSubsc.unsubscribe()
        })
    }

  }

  openLoader(): void {
    this.dialog.open(LoadingDialogComponent)
  }

  generateExcel(): void {

    //Excel Title, Header, Data
    let title = 'Reporte de Facturas Delivery'

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Facturas');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Arial', family: 4, size: 16, underline: 'double', bold: true}
    worksheet.mergeCells('A1:C2');
    worksheet.addRow([]);
    //Blank Row

    /*let subTitleRow = worksheet.addRow(['Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value])
    worksheet.mergeCells('A4:B4');
    subTitleRow.font = { name: 'Arial', family: 4, size: 12, bold: true }

    worksheet.addRow([]);*/


    worksheet.addRow([]);
    const reportHeader = [
      "No. Factura",
      "Fecha y Hora",
      "Cliente",
      "Valor"
    ]

    let reportheaderRow = worksheet.addRow(reportHeader);

    /*worksheet.mergeCells('A8:B8');*/


    reportheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'D3D3D3'},
        bgColor: {argb: 'D3D3D3'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
      cell.alignment = {
        horizontal: "center"
      }
    })

    // Add Data and Conditional Formatting
    let array1Row = []

    /*'yyyy-MM-dd', 'en'
        HH:mm', 'en')] */
    this.results.forEach(d => {
      let array = [
        +d.idFacturaDelivery,
        formatDate(d.fechaFacturacion, 'd/MM/yyyy h:m a', 'en'),
        d.delivery.cliente.nomEmpresa,
        parseFloat(d.total)
      ]
      array1Row.push(array)
    })

    array1Row.forEach(v => {
      const row = worksheet.addRow(v)
      row.getCell(1).numFmt = '#'
      row.getCell(4).numFmt = 'L#,##0.00'

      row.eachCell((cell, number) => {
        cell.alignment = {
          horizontal: "left"
        }
      })
    })

    worksheet.getColumn(1).width = 15
    worksheet.getColumn(2).width = 30
    worksheet.getColumn(3).width = 50
    worksheet.getColumn(4).width = 30


    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const date = new Date().toLocaleDateString()
      fs.saveAs(blob, 'Reporte Facturas Delivery (' + date + ').xlsx');
    })
  }

  printReport(): void {
    let divToPrint = document.getElementById('printTable')
    const newWin = window.open('', '_blank', 'width=1366,height=760,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no')
    newWin.document.open();
    newWin.document.write(divToPrint.outerHTML)
    newWin.print()
    newWin.document.close()
  }

  generatePDF(): void {/*
    let currentDriver: User = {}

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
