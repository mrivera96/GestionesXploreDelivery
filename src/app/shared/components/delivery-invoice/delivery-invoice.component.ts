import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delivery-invoice',
  templateUrl: './delivery-invoice.component.html',
  styleUrls: ['./delivery-invoice.component.css']
})
export class DeliveryInvoiceComponent implements OnInit {

  reportServer: string = 'http://190.4.56.14/reportserver?username=reportes&password=Xplore2018';
  reportUrl: string = 'Delivery/FacturaDelivery';
  showParameters: string = "false"; 
  language: string = "en-us";
  mywidth: number = 100;
  myheight: number = 100;
  toolbar: string = "false";
  accessKey = {
    "username":"reportes",
    "password":"Xplore2018",
  }
  parameters: any ;

  constructor(
    private route: ActivatedRoute
  ) { 
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.parameters =  {   
        "refNumber": params.get("refNumber"),
        
      };
    })
  }

}
