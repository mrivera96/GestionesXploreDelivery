import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-alert',
  templateUrl: './customer-alert.component.html',
  styles: [
  ]
})
export class CustomerAlertComponent implements OnInit {
  @Input() demandMSG: string

  constructor() { }

  ngOnInit(): void {
  }

}
