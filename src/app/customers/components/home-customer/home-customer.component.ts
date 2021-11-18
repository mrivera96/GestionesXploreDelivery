import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Delivery} from "../../../models/delivery";
import {LoadingDialogComponent} from "../../shared/loading-dialog/loading-dialog.component";
import {MatDialog} from "@angular/material/dialog";
declare var $: any

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class HomeCustomerComponent implements OnInit {

  msgError = ''

  constructor(
    private dialog: MatDialog,
  ) {

  }

  deliveries: Delivery[]

  ngOnInit(): void {
    this.openLoader()
  }

  setLoading(event) {
    this.dialog.closeAll()
  }

  openLoader() {
    this.dialog.open(LoadingDialogComponent)
  }

}
