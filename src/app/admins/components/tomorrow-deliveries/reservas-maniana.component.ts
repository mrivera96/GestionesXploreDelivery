import { Component, OnInit } from '@angular/core';
import {Delivery} from "../../../models/delivery";
import {Subject} from "rxjs";
import {DeliveriesService} from "../../../services/deliveries.service";
import {animate, style, transition, trigger} from "@angular/animations";
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../../components/shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-reservas-maniana',
  templateUrl: './reservas-maniana.component.html',
  styleUrls: ['./reservas-maniana.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class ReservasManianaComponent implements OnInit {
  deliveries: Delivery[]
  dtTrigger: Subject<any> = new Subject()
  loaders = {
    loadingData: false
  }

  constructor(
    public dialog: MatDialog
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
