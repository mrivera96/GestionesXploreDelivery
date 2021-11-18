import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {LoadingDialogComponent} from "../../../shared/components/loading-dialog/loading-dialog.component";
import {MatDialog} from "@angular/material/dialog";
@Component({
  selector: 'app-customer-today-orders',
  templateUrl: './customer-today-orders.component.html',
  styleUrls: ['./customer-today-orders.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerTodayOrdersComponent implements OnInit {
  loaders = {
    'loadingData': false
  }


  constructor(
    private dialog: MatDialog,
  ) { }

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
