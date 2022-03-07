import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { OrdersByCategory } from '../../../../models/orders-by-category';
import { DeliveryDetail } from '../../../../models/delivery-detail';
import { DeliveriesService } from '../../../../services/deliveries.service';
import { formatDate } from '@angular/common';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorModalComponent } from '../../../../shared/components/error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, style, transition, trigger } from '@angular/animations';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { User } from '../../../../models/user';
import { Cell, Columns, PdfMakeWrapper, Table, Txt } from 'pdfmake-wrapper';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-deliveries-report',
  templateUrl: './deliveries-report.component.html',
  styleUrls: ['./deliveries-report.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DeliveriesReportComponent implements OnInit {
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
  dtOptions1: any;
  dtTrigger: Subject<any>;
  consultResults: any = [];
  ordersInRange: number = 0;
  totalCustomerOrders: number = 0;
  ordersByCategory: OrdersByCategory[];
  totalSurcharges: number;
  totalCosts: number;
  totalExtracharges: number;
  orders: DeliveryDetail[] = [];
  initDate: any = null;
  msgError = '';

  constructor(
    private formBuilder: FormBuilder,
    private deliveriesService: DeliveriesService,
    private activatedRoute: ActivatedRoute,
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
          previous: 'Ant.',
        },
      },
    };

    this.dtOptions1 = {
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
    const serviceSubscription = this.deliveriesService
      .getDeliveriesReport(this.consultForm.value)
      .subscribe(
        (response) => {
          this.consultResults = response.data.ordersReport;
          this.totalCustomerOrders = response.data?.totalOrders;
          this.ordersByCategory = response.data?.ordersByCategory;
          this.orders = response.data.orders;
          this.totalSurcharges = response.data.totalSurcharges;
          this.totalCosts = response.data.totalCosts;
          this.totalExtracharges = response.data.totalExtraCharges;
          this.ordersInRange = response.data.ordersInRange;

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

          this.loaders.loadingSubmit = false;

          serviceSubscription.unsubscribe();
        },
        (error) => {
          this.loaders.loadingData = false;
          this.msgError =
            'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.';
          this.openErrorDialog(this.msgError);
          serviceSubscription.unsubscribe();
        }
      );
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
    const title = 'Reporte de envíos';

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Envíos');
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
    //Add Header Row
    const catTitle = worksheet.addRow(['Envíos por categoría']);
    catTitle.font = { name: 'Arial', family: 4, size: 12, bold: true };
    worksheet.addRow([]);
    const ordersByCategoryHeader = [
      'N°',
      'Categoría',
      'Envíos Realizados',
      'Recargos',
      'Cargos Extra',
      'Costos Totales',
    ];
    let ordersByCategoryheaderRow = worksheet.addRow(ordersByCategoryHeader);

    // Cell Style : Fill and Border
    ordersByCategoryheaderRow.eachCell((cell, number) => {
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
    this.ordersByCategory.forEach((d) => {
      let array = [
        index,
        d.category,
        d.orders,
        d.totalSurcharges,
        d.totalExtraCharges,
        d.cTotal,
      ];
      arrayRow.push(array);
      index++;
    });
    arrayRow.forEach((v) => {
      let row = worksheet.addRow(v);
      row.getCell(3).numFmt = '#,##0';
      row.getCell(4).numFmt = 'L#,##0.00';
      row.getCell(5).numFmt = 'L#,##0.00';
      row.getCell(6).numFmt = 'L#,##0.00';
    });

    const ordersCategoriestotals = worksheet.addRow([
      '',
      'Total:',
      this.ordersInRange,
      this.totalSurcharges,
      this.totalExtracharges,
      this.totalCosts,
    ]);
    ordersCategoriestotals.font = { bold: true };
    ordersCategoriestotals.getCell(3).numFmt = '#,##0';
    ordersCategoriestotals.getCell(4).numFmt = 'L#,##0.00';
    ordersCategoriestotals.getCell(5).numFmt = 'L#,##0.00';
    ordersCategoriestotals.getCell(6).numFmt = 'L#,##0.00';
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 30;

    worksheet.addRow([]);

    //Add Header Row
    const rangeTitle = worksheet.addRow(['Envíos por fecha']);
    rangeTitle.font = { name: 'Arial', family: 4, size: 12, bold: true };
    worksheet.addRow([]);
    const ordersByDateHeader = ['Cliente', 'fecha', 'Envíos Realizados'];
    let ordersByDateheaderRow = worksheet.addRow(ordersByDateHeader);

    // Cell Style : Fill and Border
    ordersByDateheaderRow.eachCell((cell, number) => {
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
    let array1Row = [];
    this.consultResults.forEach((d) => {
      let array = [d.customer, d.fecha, d.orders];
      array1Row.push(array);
      index++;
    });
    array1Row.forEach((v) => {
      let row = worksheet.addRow(v);
      row.getCell(3).numFmt = '#,##0';
    });
    const ordersRange = worksheet.addRow(['', 'Total:', this.ordersInRange]);
    ordersRange.getCell(3).numFmt = '#,##0';
    ordersRange.font = { bold: true };
    worksheet.addRow([]);

    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 40;

    worksheet.getColumn(11).width = 40;
    worksheet.getColumn(12).width = 40;
    worksheet.getColumn(13).width = 40;

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        'Reporte envíos (' +
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
    const title = 'Reporte de envíos';
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
    //Tabla envios por categorias
    pdf.add(new Txt('Envíos por categorías').bold().end);

    const ordersByCategoryHeader = [
      'N°',
      'Categoría',
      'Envíos Realizados',
      'Recargos',
      'Cargos Extra',
      'Costos Totales',
    ];

    pdf.add(pdf.ln(2));

    let arrayRow = [];
    let index = 1;
    this.ordersByCategory.forEach((d) => {
      let array = [
        index,
        d.category,
        d.orders,
        'L. ' + d.totalSurcharges,
        'L. ' + d.totalExtraCharges,
        'L. ' + d.cTotal,
      ];
      arrayRow.push(array);
      index++;
    });

    pdf.add(new Columns(ordersByCategoryHeader).alignment('center').bold().end);
    arrayRow.forEach((res) => {
      pdf.add(new Columns(res).alignment('center').end);
    });
    const ordersCategoriestotals = [
      '',
      'Total:',
      this.ordersInRange,
      'L. ' + this.totalSurcharges,
      'L. ' + this.totalExtracharges,
      'L. ' + this.totalCosts,
    ];
    pdf.add(new Columns(ordersCategoriestotals).alignment('center').bold().end);

    //Tabla envios por fecha
    pdf.add(pdf.ln(2));
    const rangeTitle = 'Envíos por Fecha';

    pdf.add(new Txt(rangeTitle).bold().end);
    pdf.add(pdf.ln(2));

    const ordersByDateHeader = ['Cliente', 'fecha', 'Envíos Realizados'];

    pdf.add(new Columns(ordersByDateHeader).alignment('center').bold().end);

    let array1Row = [];
    this.consultResults.forEach((d) => {
      let array = [d.customer, d.fecha, d.orders];
      array1Row.push(array);
      index++;
    });

    array1Row.forEach((res) => {
      pdf.add(new Columns(res).alignment('center').end);
    });

    const ordersRange = ['', 'Total:', this.ordersInRange];
    pdf.add(new Columns(ordersRange).alignment('center').bold().end);

    pdf.create().open();
  }
}