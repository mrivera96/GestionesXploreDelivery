import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CategoriesService } from '../../../services/categories.service';
import { Category } from '../../../models/category';
import { Subject } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryDialogComponent } from './edit-category-dialog/edit-category-dialog.component';
import { NewCategoryDialogComponent } from './new-category-dialog/new-category-dialog.component';
import { DataTableDirective } from 'angular-datatables';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-xplore-categories',
  templateUrl: './xplore-categories.component.html',
  styleUrls: ['./xplore-categories.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class XploreCategoriesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions;
  categories: Category[];
  dtTrigger: Subject<any>;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };

  constructor(
    private categoriesService: CategoriesService,
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
    const categoriesSubscription = this.categoriesService
      .getAllCategories()
      .subscribe((response) => {
        this.categories = response.data;
        this.dialog.closeAll();
        this.dtTrigger.next();
        categoriesSubscription.unsubscribe();
      });
  }

  reloadData() {
    this.ngOnInit();
  }

  showEditForm(id) {
    let currCat: Category = {};
    this.categories.forEach((value) => {
      if (value.idCategoria == id) {
        currCat = value;
      }
    });

    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      data: {
        category: currCat,
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

  showNewCatForm() {
    const dialogRef = this.dialog.open(NewCategoryDialogComponent);

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
