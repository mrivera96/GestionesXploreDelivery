import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {DataTableDirective} from "angular-datatables";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-customer-balance-report',
  templateUrl: './customer-balance-report.component.html',
  styleUrls: ['./customer-balance-report.component.css']
})
export class CustomerBalanceReportComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  datatableElement: DataTableDirective
  @ViewChild('TABLE', {static: false})
  TABLE: ElementRef;
  loaders = {
    'loadingData': false
  }
  dtTrigger: Subject<any> = new Subject<any>()
  dtOptions: DataTables.Settings
  consultForm: FormGroup
  consultResults: any = []
  msgError = ''
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

}
