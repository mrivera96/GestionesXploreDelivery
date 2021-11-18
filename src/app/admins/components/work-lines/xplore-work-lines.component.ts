import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { WorkLine } from 'src/app/models/work-line';
import { WorkLinesService } from 'src/app/services/work-lines.service';
<<<<<<< HEAD:src/app/admins/components/work-lines/xplore-work-lines.component.ts
import { ErrorModalComponent } from '../../../components/shared/error-modal/error-modal.component';
import { LoadingDialogComponent } from '../../../components/shared/loading-dialog/loading-dialog.component';
=======
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
>>>>>>> origin/V5:src/app/admins/components/work-lines/xplore-work-lines.component.ts
import { EditWorklineDialogComponent } from './edit-workline-dialog/edit-workline-dialog.component';
import { NewWorklineDialogComponent } from './new-workline-dialog/new-workline-dialog.component';

@Component({
  selector: 'app-xplore-work-lines',
  templateUrl: './xplore-work-lines.component.html',
  styles: [],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class XploreWorkLinesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions;
  workLines: WorkLine[] = [];
  dtTrigger: Subject<any>;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };

  constructor(
    private worklinesService: WorkLinesService,
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
    const worklineSubscription = this.worklinesService
      .getAllWorkLines()
      .subscribe((response) => {
        this.workLines = response.data;
        this.dialog.closeAll();
        this.dtTrigger.next();
        worklineSubscription.unsubscribe();
      });
  }

  reloadData() {
    this.ngOnInit();
  }

  showEditForm(id) {
    let currWL: WorkLine = {};
    this.workLines.forEach((value) => {
      if (value.idRubro == id) {
        currWL = value;
      }
    });

    const dialogRef = this.dialog.open(EditWorklineDialogComponent, {
      data: {
        workline: currWL,
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

  showNewWLForm() {
    const dialogRef = this.dialog.open(NewWorklineDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.loadData();
        });
      }
    });
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    if (reload) {
      dialog.afterClosed().subscribe((result) => {
        this.loaders.loadingData = true;
        this.reloadData();
      });
    }
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }
}
