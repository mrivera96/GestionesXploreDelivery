import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Customer } from '../../../models/customer';
import { UsersService } from '../../../services/users.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { XploreAddCustomerComponent } from './add-customer/xplore-add-customer.component';
import { EditCustomerDialogComponent } from './edit-customer-dialog/edit-customer-dialog.component';
import { DataTableDirective } from 'angular-datatables';
import { Delivery } from '../../../models/delivery';
import { Payment } from '../../../models/payment';
import { Router } from '@angular/router';
import { CustomerWorkLinesComponent } from './customer-work-lines/customer-work-lines.component';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-xplore-customers',
  templateUrl: './xplore-customers.component.html',
  styleUrls: ['./xplore-customers.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class XploreCustomersComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  customers: Customer[];
  dtTrigger: Subject<any> = new Subject();
  loaders = {
    loadingData: false,
  };
  dtOptions: DataTables.Settings;
  deliveries: Delivery[] = [];
  payments: Payment[] = [];

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: false,
      processing: true,
      columnDefs: [{ type: 'string', targets: 0 }],
      info: true,
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
          previous: 'Ant.',
        },
      },
    };
    this.loadData();
  }

  loadData() {
    this.openLoader();

    const usersSubscription = this.usersService
      .getCustomers()
      .subscribe((response) => {
        this.customers = response.data;

        this.dialog.closeAll();
        this.dtTrigger.next();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.columns().every(function () {
            const that = this;
            $('select', this.footer()).on('change', function () {
              if (that.search() !== this['value']) {
                that.search(this['value']).draw();
              }
            });
          });
        });
        usersSubscription.unsubscribe();
      });
  }

  showNewCustForm() {
    const dialogRef = this.dialog.open(XploreAddCustomerComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.loadData();
        });
      }
    });
  }

  showEditForm(id) {
    let currCustomer: Customer = {};
    this.customers.forEach((value) => {
      if (value.idCliente === id) {
        currCustomer = value;
      }
    });
    const dialogRef = this.dialog.open(EditCustomerDialogComponent, {
      data: {
        customer: currCustomer,
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

  showCustomerBalance(customerId, name) {
    this.router.navigate(['/admins/balance-cliente', customerId, name]);
  }

  showCustomerWorkLines(customerId) {
    const dialogRef = this.dialog.open(CustomerWorkLinesComponent, {
      data: {
        customer: customerId,
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

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }
}