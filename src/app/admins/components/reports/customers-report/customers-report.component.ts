import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {DataTableDirective} from "angular-datatables";
import {Customer} from "../../../../models/customer";
import {Subject} from "rxjs";
import {Delivery} from "../../../../models/delivery";
import {Payment} from "../../../../models/payment";
import {UsersService} from "../../../../services/users.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Workbook} from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-customers-report',
  templateUrl: './customers-report.component.html',
  styleUrls: ['./customers-report.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomersReportComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective
  customers: Customer[] = []
  dtTrigger: Subject<any> = new Subject()
  loaders = {
    loadingData: false
  }
  dtOptions: any
  deliveries: Delivery[] = []
  payments: Payment[] = []

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private router: Router
  ) {
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
    this.loadData()
  }

  loadData() {
    this.loaders.loadingData = true

    const usersSubscription = this.usersService.getCustomers().subscribe(response => {
      this.customers = response.data

      this.loaders.loadingData = false
      this.dtTrigger.next()
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.columns().every(function () {
          const that = this;
          $('select', this.footer()).on('change', function () {
            if (that.search() !== this['value']) {
              that
                .search(this['value'])
                .draw();
            }
          })
        })
      })
      usersSubscription.unsubscribe()
    })
  }

  generateExcel() {
    //Excel Title, Header, Data
    const title = 'Reporte de Clientes'

    //Create workbook and worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte Clientes');
    //Add Row and formatting
    let titleRow = worksheet.addRow([title]);
    titleRow.font = {name: 'Arial', family: 4, size: 16, underline: 'double', bold: true}
    worksheet.addRow([]);
    //Blank Row
    worksheet.addRow([]);
    worksheet.mergeCells('A1:B2');
    worksheet.addRow([]);

    worksheet.addRow([]);
    const customersHeader = ['N°',
      'Nombre de Empresa',
      'Nombre de Representante',
      'Número de Identificación',
      'Número de Teléfono',
      'email'
    ]
    let customersheaderRow = worksheet.addRow(customersHeader);

    // Cell Style : Fill and Border
    customersheaderRow.eachCell((cell, number) => {
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
    this.customers.forEach(d => {
      let array = [
        index,
        d.nomEmpresa,
        d.nomRepresentante,
        d.numIdentificacion,
        d.numTelefono,
        d.email
      ]
      arrayRow.push(array)
      index++
    })

    arrayRow.forEach(v => {
      worksheet.addRow(v);
    })

    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 40;

    worksheet.addRow([]);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, 'Reporte Clientes Xplore Delivery.xlsx');
    })
  }
}
