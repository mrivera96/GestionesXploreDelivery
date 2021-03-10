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
  dtTrigger: Subject<any>
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
    this.consultForm = this.formBuilder.group({
      customerId: ['', [Validators.required]],
      initDate: [formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })
    this.dtTrigger = new Subject<any>()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [1, 'asc'],
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
        this.consultResults = response.data.orders
        this.totalCustomerOrders = response.data?.finTotalOrders
        this.orders = response.data.details
        this.totalSurcharges = response.data.finTotalSurcharges
        this.totalCosts = response.data.finTotalCosts
        this.totalExtracharges = response.data.finTotalExtraCharges
        this.ordersInRange = response.data.finTotalOrders
        this.setResume()

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
    titleRow.font = {name: 'Arial', family: 4, size: 16, underline: 'double', bold: true}
    worksheet.addRow([]);
    //Blank Row
    worksheet.mergeCells('A1:D2');
    worksheet.addRow([]);
    let subTitleRow = worksheet.addRow(['Desde : ' + this.f.initDate.value + ' Hasta: ' + this.f.finDate.value])
    worksheet.mergeCells('A4:B4');
    subTitleRow.font = {name: 'Arial', family: 4, size: 12, bold: true}
    //Add Header Row
    const catTitle = worksheet.addRow(['Envíos por fecha']);
    catTitle.font = {name: 'Arial', family: 4, size: 12, bold: true}
    worksheet.addRow([]);
    const ordersByCategoryHeader = [
      "",
      "Transporte Turismo",
      "",
      "",
      "",
      "Moto",
      "",
      "",
      "",
      "Turismo",
      "",
      "",
      "",
      "Pick-Up",
      "",
      "",
      "",
      "Panel",
      "",
      "",
      "",
      "Pick-Up + Auxiliar",
      "",
      "",
      "",
      "Panel + Auxiliar",
      "",
      "",
      "",
      "Camión 11 pies",
      "",
      "",
      "",
      "Totales",
      "",
      "",
      "",
    ]
    let ordersByCategoryheaderRow = worksheet.addRow(ordersByCategoryHeader);

    worksheet.mergeCells('B7:E7');
    worksheet.mergeCells('F7:I7');
    worksheet.mergeCells('J7:M7');
    worksheet.mergeCells('N7:Q7');
    worksheet.mergeCells('R7:U7');
    worksheet.mergeCells('V7:Y7');
    worksheet.mergeCells('Z7:AC7');
    worksheet.mergeCells('AD7:AG7');
    worksheet.mergeCells('AH7:AK7');

    // Cell Style : Fill and Border
    ordersByCategoryheaderRow.eachCell((cell, number) => {
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

    const ordersByDateHeader = [
      "Fecha",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Costos",
    ]
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

    // Add Data and Conditional Formatting
    let arrayRow = []

    this.consultResults.forEach(d => {
      let array = [
        d.fecha,
        d.transTurism,
        d.transTurismRecargo,
        d.transTurismcExtras,
        d.transTurismcTotal,

        d.moto,
        d.motoRecargo,
        d.motocExtras,
        d.motocTotal,

        d.turismo,
        d.turismoRecargo,
        d.turismocExtras,
        d.turismocTotal,

        d.pickup,
        d.pickupRecargo,
        d.pickupcExtras,
        d.pickupcTotal,

        d.panel,
        d.panelRecargo,
        d.panelcExtras,
        d.panelcTotal,

        d.pickupAuxiliar,
        d.pickupAuxiliarRecargo,
        d.pickupAuxiliarcExtras,
        d.pickupAuxiliarcTotal,

        d.panelAuxiliar,
        d.panelAuxiliarRecargo,
        d.panelAuxiliarcExtras,
        d.panelAuxiliarcTotal,

        d.camion11,
        d.camion11Recargo,
        d.camion11cExtras,
        d.camion11cTotal,

        d.totalOrders,
        d.totalSurcharges,
        d.totalExtraCharges,
        d.totalCosts
      ]
      arrayRow.push(array)
    })
    arrayRow.forEach(v => {
      let row = worksheet.addRow(v);
      row.getCell(2).numFmt = '#,##0'
      row.getCell(3).numFmt = 'L#,##0.00'
      row.getCell(4).numFmt = 'L#,##0.00'
      row.getCell(5).numFmt = 'L#,##0.00'

      row.getCell(6).numFmt = '#,##0'
      row.getCell(7).numFmt = 'L#,##0.00'
      row.getCell(8).numFmt = 'L#,##0.00'
      row.getCell(9).numFmt = 'L#,##0.00'

      row.getCell(10).numFmt = '#,##0'
      row.getCell(11).numFmt = 'L#,##0.00'
      row.getCell(12).numFmt = 'L#,##0.00'
      row.getCell(13).numFmt = 'L#,##0.00'

      row.getCell(14).numFmt = '#,##0'
      row.getCell(15).numFmt = 'L#,##0.00'
      row.getCell(16).numFmt = 'L#,##0.00'
      row.getCell(17).numFmt = 'L#,##0.00'

      row.getCell(18).numFmt = '#,##0'
      row.getCell(19).numFmt = 'L#,##0.00'
      row.getCell(20).numFmt = 'L#,##0.00'
      row.getCell(21).numFmt = 'L#,##0.00'

      row.getCell(22).numFmt = '#,##0'
      row.getCell(23).numFmt = 'L#,##0.00'
      row.getCell(24).numFmt = 'L#,##0.00'
      row.getCell(25).numFmt = 'L#,##0.00'

      row.getCell(26).numFmt = '#,##0'
      row.getCell(27).numFmt = 'L#,##0.00'
      row.getCell(28).numFmt = 'L#,##0.00'
      row.getCell(29).numFmt = 'L#,##0.00'

      row.getCell(30).numFmt = '#,##0'
      row.getCell(31).numFmt = 'L#,##0.00'
      row.getCell(32).numFmt = 'L#,##0.00'
      row.getCell(33).numFmt = 'L#,##0.00'

      row.getCell(34).numFmt = '#,##0'
      row.getCell(35).numFmt = 'L#,##0.00'
      row.getCell(36).numFmt = 'L#,##0.00'
      row.getCell(37).numFmt = 'L#,##0.00'
    })

    const ordersCategoriestotals = worksheet.addRow([
      'Total:', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      this.ordersInRange,
      this.totalSurcharges,
      this.totalExtracharges,
      this.totalCosts]);

    ordersCategoriestotals.font = {bold: true}
    ordersCategoriestotals.getCell(34).numFmt = '#,##0'
    ordersCategoriestotals.getCell(35).numFmt = 'L#,##0.00'
    ordersCategoriestotals.getCell(36).numFmt = 'L#,##0.00'
    ordersCategoriestotals.getCell(37).numFmt = 'L#,##0.00'
    worksheet.getColumn(1).width = 25
    worksheet.getColumn(2).width = 25
    worksheet.getColumn(3).width = 25
    worksheet.getColumn(4).width = 25
    worksheet.getColumn(5).width = 25
    worksheet.getColumn(6).width = 25
    worksheet.getColumn(7).width = 25
    worksheet.getColumn(8).width = 25
    worksheet.getColumn(9).width = 25
    worksheet.getColumn(10).width = 25
    worksheet.getColumn(11).width = 25
    worksheet.getColumn(12).width = 25
    worksheet.getColumn(13).width = 25
    worksheet.getColumn(14).width = 25
    worksheet.getColumn(15).width = 25
    worksheet.getColumn(16).width = 25
    worksheet.getColumn(17).width = 25
    worksheet.getColumn(18).width = 25
    worksheet.getColumn(19).width = 25
    worksheet.getColumn(20).width = 25
    worksheet.getColumn(21).width = 25
    worksheet.getColumn(22).width = 25
    worksheet.getColumn(23).width = 25
    worksheet.getColumn(24).width = 25
    worksheet.getColumn(25).width = 25
    worksheet.getColumn(26).width = 25
    worksheet.getColumn(27).width = 25
    worksheet.getColumn(28).width = 25
    worksheet.getColumn(29).width = 25
    worksheet.getColumn(30).width = 25
    worksheet.getColumn(31).width = 25
    worksheet.getColumn(32).width = 25
    worksheet.getColumn(33).width = 25
    worksheet.getColumn(34).width = 25
    worksheet.getColumn(35).width = 25
    worksheet.getColumn(36).width = 25
    worksheet.getColumn(37).width = 25
    worksheet.getColumn(38).width = 25

    worksheet.addRow([])

    const detTitle = worksheet.addRow(['Detalle de Envíos']);
    detTitle.font = {name: 'Arial', family: 4, size: 12, bold: true}
    worksheet.addRow([]);

    const detailsHeader = [
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

    const detailsHeaderRow = worksheet.addRow(detailsHeader)

    detailsHeaderRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'D3D3D3'},
        bgColor: {argb: 'D3D3D3'}
      }
      cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}}
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
      row.getCell(10).numFmt = 'L#,##0.00'
      row.getCell(11).numFmt = 'L#,##0.00'
    })


    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
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
      new Txt('Envíos por Fecha').bold().end
    )

    const header = [
      [],
      [
        new Cell(new Txt('Transporte Turismo').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Cell(new Txt('Moto').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Turismo').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Pick-Up').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Panel').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('PickUp + Auxiliar').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Panel + Auxiliar').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Camión 11 pies').bold().end).colSpan(4).end,
      ],
      [],
      [],
      [],
      [
        new Txt('').bold().end,
        new Cell(new Txt('Totales').bold().end).colSpan(4).end,
      ],
      [],
      [],
      []
    ]

    pdf.add(
      new Columns(header).alignment("center").end
    )

    const ordersByDateHeader = [
      "Fecha",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Totales",
      "Envíos",
      "Recargos",
      "Cargos Extra",
      "Costos",
    ]

    pdf.add(
      new Columns(ordersByDateHeader).alignment("center").bold().end
    )

    let arrayRow = []
    this.consultResults.forEach(d => {
      let array = [
        d.fecha,
        d.transTurism,
        'L. ' + d.transTurismRecargo,
        'L. ' + d.transTurismcExtras,
        'L. ' + d.transTurismcTotal,

        d.moto,
        'L. ' + d.motoRecargo,
        'L. ' + d.motocExtras,
        'L. ' + d.motocTotal,

        d.turismo,
        'L. ' + d.turismoRecargo,
        'L. ' + d.turismocExtras,
        'L. ' + d.turismocTotal,

        d.pickup,
        'L. ' + d.pickupRecargo,
        'L. ' + d.pickupcExtras,
        'L. ' + d.pickupcTotal,

        d.panel,
        'L. ' + d.panelRecargo,
        'L. ' + d.panelcExtras,
        'L. ' + d.panelcTotal,

        d.pickupAuxiliar,
        'L. ' + d.pickupAuxiliarRecargo,
        'L. ' + d.pickupAuxiliarcExtras,
        'L. ' + d.pickupAuxiliarcTotal,

        d.panelAuxiliar,
        'L. ' + d.panelAuxiliarRecargo,
        'L. ' + d.panelAuxiliarcExtras,
        'L. ' + d.panelAuxiliarcTotal,

        d.camion11,
        'L. ' + d.camion11Recargo,
        'L. ' + d.camion11cExtras,
        'L. ' + d.camion11cTotal,

        d.totalOrders,
        'L. ' + d.totalSurcharges,
        'L. ' + d.totalExtraCharges,
        'L. ' + d.totalCosts
      ]
      arrayRow.push(array)
    })

    pdf.add(
      new Columns(
        ordersByDateHeader
      ).bold().end
    )
    arrayRow.forEach(res => {
      pdf.add(
        new Columns(
          res
        ).end
      )
    })

    const ordersCategoriestotals = [
      'Total:', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      this.ordersInRange,
      'L. ' + this.totalSurcharges,
      'L. ' + this.totalExtracharges,
      'L. ' + this.totalCosts]

    pdf.add(
      new Columns(ordersCategoriestotals).bold().end
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
