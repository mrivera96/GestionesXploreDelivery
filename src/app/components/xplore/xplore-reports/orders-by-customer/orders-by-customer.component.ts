import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {Customer} from "../../../../models/customer";
import {UsersService} from "../../../../services/users.service";
import {DeliveriesService} from "../../../../services/deliveries.service";
import {formatDate} from "@angular/common";
import {OrdersByCategory} from "../../../../models/orders-by-category";
import {DeliveryDetail} from "../../../../models/delivery-detail";
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {User} from "../../../../models/user";
import {Cell, Columns, PdfMakeWrapper, Table, Txt} from "pdfmake-wrapper";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.vfs = pdfFonts.pdfMake.vfs


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
  dtTrigger2: Subject<any>
  consultResults: any = []
  ordersInRange: number = 0
  filteredCustomers: Customer[]
  currenCustomer: Customer
  totalCustomerOrders: number = 0
  ordersByCategory: OrdersByCategory[]
  totalSurcharges: number
  totalCosts: number
  totalExtracharges: number
  orders: DeliveryDetail[] = []


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
    this.dtTrigger2 = new Subject<any>()
    this.consultForm = this.formBuilder.group({
      customerId: ['', [Validators.required]],
      initDate: [formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd', 'en'), Validators.required],
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
      this.totalSurcharges = 0.00
      this.totalCosts = 0.00
      this.deliveriesService.getOrdersByCustomer(this.consultForm.value).subscribe(response => {
        this.consultResults = response.data.ordersReport
        this.totalCustomerOrders = response.data?.totalOrders
        this.ordersByCategory = response.data?.ordersByCategory
        this.orders = response.data.orders
        this.totalSurcharges = response.data.totalSurcharges
        this.totalCosts = response.data.totalCosts
        this.totalExtracharges = response.data.totalExtraCharges
        this.ordersInRange = response.data.ordersInRange
        this.setResume()

        if (this.datatableElement.dtInstance) {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.destroy()
              this.dtTrigger.next()
              this.dtTrigger1.next()
              this.dtTrigger2.next()
            })
        } else {
          this.dtTrigger.next()
          this.dtTrigger1.next()
          this.dtTrigger2.next()
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
    const title = 'Reporte de envíos - ' + this.currenCustomer.nomEmpresa;

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Envíos');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Arial', family: 4, size: 16, underline: 'double', bold: true }
    worksheet.addRow([]);
    //Blank Row
    worksheet.addRow([]);
    let totalOrders = worksheet.addRow(['Envíos Totales : ' + this.totalCustomerOrders])

    totalOrders.font = { name: 'Arial', family: 4, size: 12, bold: true }
    worksheet.mergeCells('A1:D2');
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value])
    worksheet.mergeCells('A6:B6');
    subTitleRow.font = { name: 'Arial', family: 4, size: 12, bold: true }
    //Add Header Row
    const catTitle = worksheet.addRow(['Envíos por categoría']);
    catTitle.font = { name: 'Arial', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    const ordersByCategoryHeader = [
      "N°",
      "Categoría",
      "Envíos Realizados",
      "Recargos",
      "Cargos Extra",
      "Costos Totales"
    ]
    let ordersByCategoryheaderRow = worksheet.addRow(ordersByCategoryHeader);

    // Cell Style : Fill and Border
    ordersByCategoryheaderRow.eachCell((cell, number) => {
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
    let arrayRow = []
    let index = 1
    this.ordersByCategory.forEach(d => {
      let array = [index, d.category, d.orders, d.totalSurcharges, d.totalExtraCharges, d.cTotal]
      arrayRow.push(array)
      index++
    })
    arrayRow.forEach(v => {
      let row = worksheet.addRow(v);
      row.getCell(3).numFmt = '#,##0'
      row.getCell(4).numFmt = 'L#,##0.00'
      row.getCell(5).numFmt = 'L#,##0.00'
      row.getCell(6).numFmt = 'L#,##0.00'
    })

    const ordersCategoriestotals = worksheet.addRow(['', 'Total:', this.ordersInRange, this.totalSurcharges, this.totalExtracharges, this.totalCosts]);
    ordersCategoriestotals.font = { bold: true }
    ordersCategoriestotals.getCell(3).numFmt = '#,##0'
    ordersCategoriestotals.getCell(4).numFmt = 'L#,##0.00'
    ordersCategoriestotals.getCell(5).numFmt = 'L#,##0.00'
    ordersCategoriestotals.getCell(6).numFmt = 'L#,##0.00'
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 40;

    worksheet.addRow([]);

    //Add Header Row
    const rangeTitle = worksheet.addRow(['Envíos por fecha']);
    rangeTitle.font = { name: 'Arial', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    const ordersByDateHeader = ["Cliente", "fecha", "Envíos Realizados"]
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
      let array = [d.customer, d.fecha, d.orders]
      array1Row.push(array)
      index++
    })
    array1Row.forEach(v => {
      let row = worksheet.addRow(v);
      row.getCell(3).numFmt = '#,##0'
    })
    const ordersRange = worksheet.addRow(['', 'Total:', this.ordersInRange]);
    ordersRange.getCell(3).numFmt = '#,##0'
    ordersRange.font = { bold: true }
    worksheet.addRow([]);
    const detailTitle = worksheet.addRow(['Detalles de envíos']);
    detailTitle.font = { name: 'Arial', family: 4, size: 12, bold: true }
    worksheet.addRow([]);
    //Agregar los detalles de los envios
    const ordersHeader = [
      "N° Envío",
      "N° Reserva",
      "Destinatario",
      "Celular del Destinatario",
      "Dirección",
      "Detalle",
      "Distancia",
      "Tarifa Base",
      "Recargo",
      "Cargos Extra",
      "Costo",
      "Estado",
      "Detalle Cargo Extra",
      "Observaciones",
      "Conductor"
    ]
    let ordersheaderRow = worksheet.addRow(ordersHeader);

    // Cell Style : Fill and Border
    ordersheaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })

    let detailsRow = []
    this.orders.forEach(d => {
      let orderEC = ''
      d.extra_charges.forEach(value => {
          orderEC = orderEC + ' ' + value.extracharge.nombre
      })

      let array = [
        d.idDetalle,
        Number(d.idDelivery),
        d.nomDestinatario,
        d.numCel,
        d.direccion,
        d.nFactura,
        d.distancia,
        Number(d.tarifaBase),
        Number(d.recargo),
        Number(d.cargosExtra),
        Number(d.cTotal),
        d.estado.descEstado + ' Fecha: ' + d.fechaEntrega,
        orderEC,
        d.observaciones,
        d.conductor?.nomUsuario
      ]
      detailsRow.push(array)

    })

    detailsRow.forEach(v => {
      let row = worksheet.addRow(v);
      row.getCell(1).numFmt = '#,##0'
      row.getCell(2).numFmt = '#,##0'
      row.getCell(8).numFmt = 'L#,##0.00'
      row.getCell(9).numFmt = 'L#,##0.00'
      row.getCell(11).numFmt = 'L#,##0.00'
      row.getCell(12).numFmt = 'L#,##0.00'
    })

    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 40;
    worksheet.getColumn(6).width = 40;
    worksheet.getColumn(8).width = 40;
    worksheet.getColumn(9).width = 40;
    worksheet.getColumn(10).width = 40;

    worksheet.getColumn(11).width = 40;
    worksheet.getColumn(12).width = 40;
    worksheet.getColumn(13).width = 40;
    worksheet.getColumn(14).width = 40;
    worksheet.getColumn(15).width = 40;

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Reporte envíos (' + this.currenCustomer.nomEmpresa + ').xlsx');
    })
  }

  generatePDF() {
    //Titulo del reporte
    const title = 'Reporte de envíos - ' + this.currenCustomer.nomEmpresa;

    const pdf = new PdfMakeWrapper()

    pdf.pageSize('A1')
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
    //Tabla envios por categorias
    pdf.add(
      new Txt('Envíos por categorías').bold().end
    )

    const ordersByCategoryHeader = [
      "N°",
      "Categoría",
      "Envíos Realizados",
      "Recargos",
      "Cargos Extra",
      "Costos Totales"
    ]

    pdf.add(
      pdf.ln(2)
    )

    let arrayRow = []
    let index = 1
    this.ordersByCategory.forEach(d => {
      let array = [index, d.category, d.orders, 'L. ' + d.totalSurcharges, 'L. ' + d.totalExtraCharges, 'L. ' + d.cTotal]
      arrayRow.push(array)
      index++
    })

    pdf.add(
      new Columns(
          ordersByCategoryHeader
      ).bold().end
    )
    arrayRow.forEach(res => {
      pdf.add(
        new Columns(
            res
        ).end
      )
    })
    const ordersCategoriestotals = ['', 'Total:', this.ordersInRange, 'L. ' + this.totalSurcharges, 'L. ' + this.totalExtracharges,  'L. ' + this.totalCosts]
    pdf.add(
      new Columns(ordersCategoriestotals).bold().end
    )

    //Tabla envios por fecha
    pdf.add(
      pdf.ln(2)
    )
    const rangeTitle = 'Envíos por Fecha'

    pdf.add(
      new Txt(rangeTitle).bold().end
    )
    pdf.add(
      pdf.ln(2)
    )

    const ordersByDateHeader = ["Cliente", "fecha", "Envíos Realizados"]

    pdf.add(
      new Columns(ordersByDateHeader).bold().end
    )

    let array1Row = []
    this.consultResults.forEach(d => {
      let array = [d.customer, d.fecha, d.orders]
      array1Row.push(array)
      index++
    })

    array1Row.forEach(res => {
      pdf.add(
        new Columns(
          res
        ).end
      )
    })

    const ordersRange =['', 'Total:', this.ordersInRange]
    pdf.add(
      new Columns(
        ordersRange
      ).bold().end
    )

    //Tabla detalles de envios

    pdf.add(
      pdf.ln(2)
    )

    const detailTitle = 'Detalles de Envíos'

    pdf.add(
      new Txt(detailTitle).bold().end
    )
    pdf.add(
      pdf.ln(2)
    )

    const ordersHeader = [
      "N° Envío",
      "N° Reserva",
      "Destinatario",
      "Celular del Destinatario",
      "Dirección",
      "Detalle",
      "Distancia",
      "Tarifa Base",
      "Recargo",
      "Cargos Extra",
      "Costo",
      "Estado",
      "Detalle Cargo Extra",
      "Observaciones",
      "Conductor"
    ]

    pdf.add(
      new Columns(
        ordersHeader
      ).bold().alignment('center').end
    )

    let detailsRow = []
    this.orders.forEach(d => {
      let orderEC = ''
      d.extra_charges.forEach(value => {
        orderEC = orderEC + ' ' + value.extracharge.nombre
      })

      let array = [
        d.idDetalle,
        Number(d.idDelivery),
        d.nomDestinatario,
        d.numCel,
        d.direccion,
        d.nFactura,
        d.distancia,
        'L. ' + Number(d.tarifaBase),
        'L. ' + Number(d.recargo),
        'L. ' + Number(d.cargosExtra),
        'L. ' + Number(d.cTotal),
        d.estado.descEstado + ' Fecha: ' + d.fechaEntrega,
        orderEC || 'N/A',
        d.observaciones || 'N/A',
        d.conductor?.nomUsuario
      ]
      detailsRow.push(array)

    })

    detailsRow.forEach(res => {
      pdf.add(
        new Columns(res).alignment('center').end
      )
    })

    pdf.create().open()

  }

}
