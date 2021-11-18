import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsService } from '../../../../services/payments.service';
import { formatDate } from '@angular/common';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Cell, Columns, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PaymentsReportComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  @ViewChild('TABLE', { static: false })
  TABLE: ElementRef;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  consultForm: FormGroup;
  dtOptions: any;
  dtTrigger: Subject<any>;
  consultResults: any = [];
  initDate: any = null;
  msgError = '';
  totalAmount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private paymentsService: PaymentsService,
    public dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.dtTrigger = new Subject<any>();
    this.consultForm = this.formBuilder.group({
      initDate: [
        formatDate(
          new Date().setDate(new Date().getDate() - 7),
          'yyyy-MM-dd',
          'en'
        ),
        Validators.required,
      ],
      finDate: [
        formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        Validators.required,
      ],
    });

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
          previous: 'Ant.',
        },
      },
    };
  }

  loadData() {
    this.loaders.loadingSubmit = true;
    const paymentsSubscription = this.paymentsService
      .getPaymentsReport(this.consultForm.value)
      .subscribe((response) => {
        this.consultResults = response.data;
        this.totalAmount = response.totalAmount;
        this.loaders.loadingSubmit = false;
        this.initDate = false;

        if (this.datatableElement.dtInstance) {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            }
          );
        } else {
          this.dtTrigger.next();
        }

        paymentsSubscription.unsubscribe();
      });
  }

  get f() {
    return this.consultForm.controls;
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.loadData();
    }
  }

  generateExcel() {
    //Excel Title, Header, Data
    const title = 'Reporte de Pagos';

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Pagos');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Arial',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true,
    };
    worksheet.addRow([]);
    //Blank Row
    worksheet.addRow([]);
    worksheet.mergeCells('A1:B2');
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow([
      'Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value,
    ]);
    worksheet.mergeCells('A5:B5');
    subTitleRow.font = { name: 'Arial', family: 4, size: 12, bold: true };

    worksheet.addRow([]);
    const paymentsHeader = [
      'N°',
      'Fecha de Pago',
      'Monto',
      'Tipo de Pago',
      'Cliente',
      'Referencia',
      'Banco',
      'Número de Autorización',
    ];
    let paymentsheaderRow = worksheet.addRow(paymentsHeader);

    // Cell Style : Fill and Border
    paymentsheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    // worksheet.addRows(data);
    // Add Data and Conditional Formatting
    let arrayRow = [];
    let index = 1;
    this.consultResults.forEach((d) => {
      let array = [
        index,
        d.fechaPago,
        d.monto,
        d.payment_type.nomTipoPago,
        d.customer.nomEmpresa,
        d.referencia,
        d.banco,
        d.numAutorizacion,
      ];
      arrayRow.push(array);
      index++;
    });
    arrayRow.forEach((v) => {
      let row = worksheet.addRow(v);
      row.getCell(3).numFmt = '#,##0.00';
    });

    const paymentstotals = worksheet.addRow([
      '',
      'Total:',
      this.totalAmount,
      '',
      '',
      '',
      '',
      '',
    ]);
    paymentstotals.font = { bold: true };

    paymentstotals.getCell(3).numFmt = '#,##0.00';
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 30;

    worksheet.addRow([]);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        'Reporte Pagos (' +
          this.f.initDate.value +
          ' - ' +
          this.f.finDate.value +
          ').xlsx'
      );
    });
  }

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }

  generatePDF() {
    //Titulo del reporte
    const title = 'Reporte de pagos';
    const pdf = new PdfMakeWrapper();

    pdf.pageSize('legal');
    pdf.pageOrientation('landscape');

    pdf.add(new Txt(title).bold().end);
    pdf.add(pdf.ln(2));
    pdf.add(
      new Txt(
        'Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value
      ).italics().end
    );
    pdf.add(pdf.ln(2));
    const paymentsHeader = [
      'N°',
      'Fecha de Pago',
      'Monto',
      'Tipo de Pago',
      'Cliente',
      'Referencia',
      'Banco',
      'Número de Autorización',
    ];

    pdf.add(pdf.ln(2));

    let arrayRow = [];
    let index = 1;
    this.consultResults.forEach((d) => {
      let array = [
        index,
        d.fechaPago,
        'L. ' + d.monto,
        d.payment_type.nomTipoPago,
        d.customer.nomEmpresa,
        d.referencia || 'N/A',
        d.banco || 'N/A',
        d.numAutorizacion || 'N/A',
      ];
      arrayRow.push(array);
      index++;
    });

    pdf.add(new Columns(paymentsHeader).alignment('center').bold().end);

    arrayRow.forEach((v) => {
      pdf.add(new Columns(v).alignment('center').end);
    });

    const paymentstotals = [
      '',
      'Total:',
      'L. ' + this.totalAmount,
      '',
      '',
      '',
      '',
      '',
    ];
    pdf.add(new Columns(paymentstotals).alignment('center').bold().end);

    pdf.create().open();
  }
}
