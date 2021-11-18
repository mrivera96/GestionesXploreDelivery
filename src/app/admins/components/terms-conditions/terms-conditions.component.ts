import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TermCondition } from '../../../models/term-condition';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { MatDialog } from '@angular/material/dialog';
import { TermConditionsService } from '../../../services/term-conditions.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { EditTermsDialogComponent } from './edit-terms-dialog/edit-terms-dialog.component';
import { CreateTermsDialogComponent } from './create-terms-dialog/create-terms-dialog.component';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TermsConditionsComponent implements OnInit {
  termsConditions: TermCondition[];
  dtTrigger: Subject<any>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions;

  constructor(
    public dialog: MatDialog,
    private termsService: TermConditionsService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize() {
    this.dtTrigger = new Subject<any>();
    this.dtOptions = {
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
          previous: 'Ant.',
        },
      },
    };
  }

  loadData() {
    this.openLoader();
    const termsSubsc = this.termsService.get().subscribe(
      (response) => {
        this.termsConditions = response.data;
        this.dialog.closeAll();
        this.dtTrigger.next();
        termsSubsc.unsubscribe();
      },
      (error) => {
        error.subscribe((err) => {
          this.openErrorDialog(err.statusText, false);
          termsSubsc.unsubscribe();
        });
      }
    );
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    if (reload) {
      dialog.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
    }
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }

  openEditDialog(currTerm): void {
    const dialogRef = this.dialog.open(EditTermsDialogComponent, {
      data: {
        termCondition: currTerm,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.loadData();
        });
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTermsDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.loadData();
        });
      }
    });
  }
}
