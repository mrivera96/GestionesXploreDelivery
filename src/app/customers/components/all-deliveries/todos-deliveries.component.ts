import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Delivery } from '../../../models/delivery';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { State } from '../../../models/state';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveriesService } from '../../../services/deliveries.service';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-todos-deliveries',
  templateUrl: './todos-deliveries.component.html',
  styleUrls: ['./todos-deliveries.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TodosDeliveriesComponent implements OnInit {
  deliveries: Delivery[];
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  initDate: any = null;
  finDate: any = null;
  states: State[];
  consultForm: FormGroup;
  currentUser: User;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private deliveriesService: DeliveriesService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.initialize();

    this.loadData();
  }

  loadData() {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.get('initDate') && params.get('finDate')) {
        this.initDate = true;
        this.consultForm.get('initDate').setValue(params.get('initDate'));
        this.consultForm.get('finDate').setValue(params.get('finDate'));
      }
    });

    if (this.initDate == true) {
      this.openLoader();
      const stateSubscription = this.deliveriesService
        .getStates()
        .subscribe((response) => {
          this.states = response.data.xploreDelivery;
          stateSubscription.unsubscribe();
        });

      const serviceSubscription = this.deliveriesService
        .getFilteredDeliveries(this.consultForm.value)
        .subscribe((response) => {
          this.dialog.closeAll();
          this.deliveries = response.data;
          this.deliveries.forEach((delivery) => {
            delivery.entregas = delivery.detalle.length;
          });

          this.dtTrigger.next();
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              dtInstance.columns().every(function () {
                const that = this;
                $('select', this.footer()).on('change', function () {
                  if (that.search() !== this['value']) {
                    that.search(this['value']).draw();
                  }
                });
              });
            }
          );
          serviceSubscription.unsubscribe();
        });
    }
  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      autoWidth: true,
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

    this.consultForm = this.formBuilder.group({
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
    });
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.router.navigate([
        '/customers/reservas-todos',
        this.consultForm.get('initDate').value,
        this.consultForm.get('finDate').value,
      ]);
    }
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }
}
