import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { Subject } from 'rxjs';
import { formatDate } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-customers-tracking-report',
  templateUrl: './customers-tracking-report.component.html',
  styleUrls: ['./customers-tracking-report.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class CustomersTrackingReportComponent implements OnInit {
  consultForm: FormGroup;
  consultResults: any[] = [];
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  loaders = {
    loadingData: false,
    loadingSubmit: false,
  };
  dtOptions: any;
  dtTrigger: Subject<any>;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.dtTrigger = new Subject<any>();
    this.consultForm = this.formBuilder.group({
      numMinEnvios: [5, [Validators.required]],
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
      initDateWO: [
        formatDate(new Date(), 'yyyy-MM-dd', 'en'),
        Validators.required,
      ],
      finDateWO: [
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
      dom: 'Bfrtip',
      buttons: ['excel', 'pdf'],
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
  }

  get f() {
    return this.consultForm.controls;
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.loaders.loadingSubmit = true;
      const usersSubscription = this.usersService
        .getCustomersTrackingReport(this.consultForm.value)
        .subscribe((response) => {
          this.consultResults = response.data;
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
          usersSubscription.unsubscribe();
        });
    }
  }
}
