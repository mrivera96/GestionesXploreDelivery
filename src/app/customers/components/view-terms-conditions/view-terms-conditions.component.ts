import { Component, OnInit } from '@angular/core';
import {TermConditionsService} from "../../../services/term-conditions.service";
import {TermCondition} from "../../../models/term-condition";
import {ErrorModalComponent} from "../../../shared/components/error-modal/error-modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LoadingDialogComponent} from "../../../shared/components/loading-dialog/loading-dialog.component";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-view-terms-conditions',
  templateUrl: './view-terms-conditions.component.html',
  styleUrls: ['./view-terms-conditions.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class ViewTermsConditionsComponent implements OnInit {

  termsConditions: TermCondition[] = []
  constructor(private termsConditionsService: TermConditionsService,
              public dialogRef: MatDialogRef<LoadingDialogComponent>,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData(){
    this.openLoader()
    const termsSubsc = this.termsConditionsService
      .get().subscribe(response => {
        this.termsConditions = response.data
        this.dialog.closeAll()
        termsSubsc.unsubscribe()
      },error => {
        error.subscribe(error => {
          this.dialog.closeAll()
          this.openErrorDialog(error.statusText)
          termsSubsc.unsubscribe()
        })
      })

  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  openLoader(){
    this.dialog.open(LoadingDialogComponent)
  }

}
