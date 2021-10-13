import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataTableDirective } from 'angular-datatables';
import { ReportRequest } from '../../../../models/report-request';
import { ReportRequestsService } from '../../../../services/report-requests.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddRequestsDialogComponent } from './add-requests-dialog/add-requests-dialog.component';
import { LoadingDialogComponent } from '../../../../shared/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-report-requests',
  templateUrl: './report-requests.component.html',
  styleUrls: ['./report-requests.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ReportRequestsComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions;
  reportRequests: ReportRequest[];
  dtTrigger: Subject<any>;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };

  constructor(
    private reportRequestsService: ReportRequestsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize() {
    this.dtTrigger = new Subject<any>();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
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
    this.openLoader();
    const rRequestSubscription = this.reportRequestsService
      .getReportRequests()
      .subscribe((response) => {
        this.reportRequests = response.data;
        this.dialog.closeAll();
        this.dtTrigger.next();
        rRequestSubscription.unsubscribe();
      });
  }

  showAddDialog() {
    const dialogRef = this.dialog.open(AddRequestsDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.loadData();
        });
      }
    });
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }
}
