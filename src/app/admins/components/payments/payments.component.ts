import {Component, OnInit, ViewChild} from '@angular/core';
import {PaymentsService} from "../../../services/payments.service";
import {Payment} from "../../../models/payment";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {AddPaymentDialogComponent} from "./add-payment-dialog/add-payment-dialog.component";
import { LoadingDialogComponent } from '../../../components/shared/loading-dialog/loading-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class PaymentsComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective
  dtOptions
  loaders = {
    'loadingData': false
  }
  dtTrigger: Subject<any>
  payments: Payment[]
  consultForm: FormGroup;
  initDate: any = null;
  finDate: any = null;

  constructor(
    private paymentsService: PaymentsService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.loadData()
  }
  initialize(){
    this.dtTrigger = new Subject<any>()

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 25,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
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
          previous: 'Ant.'
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
      const paymentsSubscription = this.paymentsService
        .getPayments(this.consultForm.value)
        .subscribe((response) => {
          this.payments = response.data;
          this.dialog.closeAll();
          this.dtTrigger.next();
          this.dtElement.dtInstance.then(
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
          paymentsSubscription.unsubscribe();
        });
    }
  }

  onConsultFormSubmit() {
    if (this.consultForm.valid) {
      this.router.navigate([
        '/admins/pagos',
        this.consultForm.get('initDate').value,
        this.consultForm.get('finDate').value,
      ]);
    }
  }

  showNewForm(){
    const dialogRef = this.dialog.open(AddPaymentDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.loadData()
          })
      }
    })

  }

  showEditForm(id){

  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
