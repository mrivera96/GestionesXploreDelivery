import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { LoadingDialogComponent } from 'src/app/shared/components/loading-dialog/loading-dialog.component';
import { AddQueryUserComponent } from './add-query-user/add-query-user.component';
import { UpdateQueryUserComponent } from './update-query-user/update-query-user.component';

@Component({
  selector: 'app-query-users',
  templateUrl: './query-users.component.html',
  styleUrls: ['./query-users.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class QueryUsersComponent implements OnInit {
  users: User[];
  dtOptions;
  dtTrigger: Subject<any>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(private usersService: UsersService, private dialog: MatDialog) {
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

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.openLoader();
    const usrsSubs = this.usersService.getQueryUsers().subscribe(
      (response) => {
        this.users = response.data;
        this.dtTrigger.next();
        this.dialog.closeAll();
        usrsSubs.unsubscribe();
      },
      (error) => {
        error.subscribe((err) => {
          this.openErrorDialog(err.statusText, true);
        });

        usrsSubs.unsubscribe();
      }
    );
  }

  addUser() {
    const dialRef = this.dialog.open(AddQueryUserComponent);
    dialRef.afterClosed().subscribe((res) => {
      if (res) {
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

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    if (reload) {
      dialog.afterClosed().subscribe(() => {
        this.dialog.closeAll();
        this.ngOnInit;
      });
    }
  }

  editUser(user) {
    const dialRef = this.dialog.open(UpdateQueryUserComponent,{
      data:{
        currUser: user
      }
    });
    dialRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.loadData();
        });
      }
    });
  }
}
