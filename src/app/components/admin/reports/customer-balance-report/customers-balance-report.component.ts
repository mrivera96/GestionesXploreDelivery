import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {UsersService} from "../../../../services/users.service";
import {formatDate} from "@angular/common";
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {Cell, Columns, PdfMakeWrapper, Table, Txt} from "pdfmake-wrapper";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'app-customer-balance-report',
  templateUrl: './customer-balance-report.component.html',
  styleUrls: ['./customer-balance-report.component.css']
})
export class CustomersBalanceReportComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective
  @ViewChild('TABLE', {static: false})
  TABLE: ElementRef;
  loaders = {
    'loadingData': false,
    'loadingSubmit': false,
  }
  dtTrigger: Subject<any> = new Subject<any>()
  dtOptions: any
  consultForm: FormGroup
  consultResults: any = []
  msgError = ''
  totalOrders: number = 0
  totalPayments: number = 0.00
  totalBalance: number = 0.00
  totalCredit: number = 0.00
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.initialize()
  }

  initialize() {
    this.dtTrigger = new Subject<any>()
    this.consultForm = this.formBuilder.group({
      initDate: [formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
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

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.loaders.loadingSubmit = true
      const reportSubscription = this.usersService.getCustomersBalanceReport(this.consultForm.value)
        .subscribe(response => {
          this.consultResults = response.data
          this.totalOrders = response.totalOrders
          this.totalPayments = response.totalPayments
          this.totalBalance = response.totalBalance
          this.totalCredit = response.totalCredit
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
          reportSubscription.unsubscribe()
        })
    }
  }

  get f() {
    return this.consultForm.controls
  }

  generateExcel() {

    //Excel Title, Header, Data
    const title = 'Reporte Balance de Clientes'

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Balance de Clientes');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Arial', family: 4, size: 16, underline: 'double', bold: true}
    worksheet.addRow([]);
    //Blank Row
    worksheet.addRow([]);
    worksheet.mergeCells('A1:B2');
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value])
    worksheet.mergeCells('A5:B5');
    subTitleRow.font = {name: 'Arial', family: 4, size: 12, bold: true}

    worksheet.addRow([]);
    const paymentsHeader = [
      "Código Cliente",
      "Nombre",
      "Envíos",
      "Pagos",
      "Balance",
      "Crédito Disponible"
    ]
    let paymentsheaderRow = worksheet.addRow(paymentsHeader);

    // Cell Style : Fill and Border
    paymentsheaderRow.eachCell((cell, number) => {
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

    this.consultResults.forEach(d => {
      let array = [
        d.customer.idCliente,
        d.customer.nomEmpresa,
        d.orders,
        d.payments,
        d.balance,
        d.credit
       ]
      arrayRow.push(array)
    })
    arrayRow.forEach(v => {
      let row = worksheet.addRow(v);
      row.getCell(3).numFmt = '#,##0'
      row.getCell(4).numFmt = 'L#,##0.00'
      row.getCell(5).numFmt = 'L#,##0.00'
      row.getCell(6).numFmt = 'L#,##0.00'
    })


    const paymentstotals = worksheet.addRow(['', 'Total:', this.totalOrders, this.totalPayments, this.totalBalance, this.totalCredit]);
    paymentstotals.font = {bold: true}

    paymentstotals.getCell(3).numFmt = '#,##0'
    paymentstotals.getCell(4).numFmt = 'L#,##0.00'
    paymentstotals.getCell(5).numFmt = 'L#,##0.00'
    paymentstotals.getCell(6).numFmt = 'L#,##0.00'
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;

    worksheet.addRow([]);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, 'Reporte Balances (' + this.f.initDate.value + ' - ' + this.f.finDate.value + ').xlsx');
    })
  }

  generatePDF() {
    //Titulo del reporte
    const title = 'Reporte Balance de Clientes'
    const pdf = new PdfMakeWrapper()

    pdf.pageSize('letter')
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
    const paymentsHeader = [
      "Código Cliente",
      "Nombre",
      "Envíos",
      "Pagos",
      "Balance",
      "Crédito Disponible"
    ]
    pdf.add(
      pdf.ln(2)
    )

    let arrayRow = []
    this.consultResults.forEach(d => {
      let array = [
        d.customer.idCliente,
        d.customer.nomEmpresa,
        d.orders,
        'L. ' + d.payments,
        'L. ' + d.balance,
        'L. ' + d.credit
       ]
      arrayRow.push(array)
    })

    pdf.add(
      new Columns(
          paymentsHeader
      ).bold().end
    )

    arrayRow.forEach(v => {
      pdf.add(
        new Columns(v).end
      )
    })

    const paymentstotals = ['', 'Total:', this.totalOrders, 'L. ' + this.totalPayments, 'L. ' + this.totalBalance,  'L. ' + this.totalCredit]
    pdf.add(
      new Columns(paymentstotals).bold().end
    )

    pdf.create().open()
  }

}
