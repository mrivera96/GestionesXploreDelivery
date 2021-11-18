import { Component, OnInit, ViewChild } from '@angular/core';
import { DeliveriesService } from '../../../services/deliveries.service';
import { Delivery } from '../../../models/delivery';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { State } from '../../../models/state';
import { formatDate } from '@angular/common';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-todas-reservas',
  templateUrl: './ver-todas-reservas.component.html',
  styleUrls: ['./ver-todas-reservas.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class VerTodasReservasComponent implements OnInit {
  consultForm: FormGroup;
  deliveries: Delivery[];
  dtTrigger: Subject<any> = new Subject<any>();
  loaders = {
    loadingData: false,
  };
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  initDate: any = null;
  finDate: any = null;
  dtOptions: any;

  states: State[];

  constructor(
    private router: Router,
    private deliveriesService: DeliveriesService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

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
      const deliveriesSubscription = this.deliveriesService
        .getStates()
        .subscribe((response) => {
          this.states = response.data.xploreDelivery;
          deliveriesSubscription.unsubscribe();
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
      pageLength: 100,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [2, 'desc'],
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

  setLoading(event) {
    this.loaders.loadingData = event;
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.router.navigate([
        '/admins/reservas-todas',
        this.consultForm.get('initDate').value,
        this.consultForm.get('finDate').value,
      ]);
    }
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent);
  }
}
