import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {LoadingDialogComponent} from "../../shared/loading-dialog/loading-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Order} from "../../../models/order";
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {User} from "../../../models/user";
import {State} from "../../../models/state";
import {DeliveriesService} from "../../../services/deliveries.service";
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {formatDate} from "@angular/common";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {ViewPhotosDialogComponent} from "../../shared/view-photos-dialog/view-photos-dialog.component";
import {OrderDetailDialogComponent} from "../../shared/order-detail-dialog/order-detail-dialog.component";

@Component({
  selector: 'app-customer-all-orders',
  templateUrl: './customer-all-orders.component.html',
  styleUrls: ['./customer-all-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerAllOrdersComponent implements OnInit {

  consultForm: FormGroup
  orders: Order[]
  dtTrigger: Subject<any> = new Subject<any>()
  dtOptions: DataTables.Settings
  msgError = ''
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective
  initDate: any = null
  finDate: any = null

  currUser: User
  states: State[]
  loaders = {
    'loadingData': false
  }

  constructor(
    public dialog: MatDialog,
    private deliveriesService: DeliveriesService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.initialize()
    this.currUser = this.authService.currentUserValue

    this.loadData()
  }

  initialize() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: false,
      processing: true,
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
          previous: 'Ant.'
        },
      },
    }

    this.consultForm = this.formBuilder.group({
      initDate: [formatDate(new Date().setDate(new Date().getDate() - 7), 'yyyy-MM-dd', 'en'), Validators.required],
      finDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })
  }
  loadData() {

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get("initDate") && params.get("finDate")) {
        this.initDate = true
        this.consultForm.get('initDate').setValue(params.get("initDate"))
        this.consultForm.get('finDate').setValue(params.get("finDate"))
      }
    })

    if (this.initDate == true) {
      this.openLoader()
      const deliveriesSubscription = this.deliveriesService.getStates().subscribe(response => {
        this.states = response.data.xploreDeliveryEntregas
        deliveriesSubscription.unsubscribe()
      })
      const serviceSubscription = this.deliveriesService.getFilteredOrders(this.consultForm.value).subscribe(response => {
        this.orders = response.data
        this.orders.forEach(order => {
          order.delivery.fechaReserva = formatDate(new Date(order.delivery.fechaReserva), 'yyyy-MM-dd', 'en')
        })

        this.dtTrigger.next()
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.columns().every(function () {
            const that = this;
            $('select', this.footer()).on('change', function () {
              if (that.search() !== this['value']) {
                that
                  .search(this['value'])
                  .draw();
              }
            })
          })
        })
        this.dialog.closeAll()

        serviceSubscription.unsubscribe()

      }, error => {
        this.dialog.closeAll()
        this.msgError = 'Ha ocurrido un error al cargar los datos. Intenta de nuevo recargando la página.'
        this.openErrorDialog(this.msgError, true)
        serviceSubscription.unsubscribe()
      })
    }


  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })

    if (reload) {
      dialog.afterClosed().subscribe(result => {
        this.loaders.loadingData = false
        this.reloadData()
      })
    }

  }

  reloadData() {
    this.ngOnInit()
  }


  openPhotosDialog(photos) {
    const dialogRef = this.dialog.open(ViewPhotosDialogComponent, {
      data: {
        photos: photos
      }
    })

  }

  showDetailDialog(order) {
    const dialogRef = this.dialog.open(OrderDetailDialogComponent,
      {
        data: {
          currentOrder: order,
          currentDelivery: order.delivery,
          currentUser: this.currUser
        }
      }
    )

    /*dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.datatableElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.destroy()
            this.ngOnInit()
          })
      }
    })*/
  }

  onConsultFormSubmit() {

    if (this.consultForm.valid) {
      this.route.navigate(['/customers/envios-todos', this.consultForm.get('initDate').value,
        this.consultForm.get('finDate').value])
    }
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
