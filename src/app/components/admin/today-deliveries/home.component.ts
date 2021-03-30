import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import { MatDialog } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  loaders = {
    'loadingData': false
  }

  constructor(
    public dialog: MatDialog
  ) {

  }

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
