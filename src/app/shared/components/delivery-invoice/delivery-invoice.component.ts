import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillingService } from 'src/app/services/billing.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-delivery-invoice',
  templateUrl: './delivery-invoice.component.html',
  styleUrls: ['./delivery-invoice.component.css']
})
export class DeliveryInvoiceComponent implements OnInit {

  refNumber: string ;
  imagePath: SafeResourceUrl;
  base64: string;

  constructor(
    private route: ActivatedRoute,
    private billingService: BillingService,
    private _sanitizer: DomSanitizer
  ) { 
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.refNumber =  params.get("refNumber");
    });

    this.billingService.getInvoice(this.refNumber).subscribe(response => {
      this.base64 = response;
      this.imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' 
               + this.base64);
    });

  }

  downloadPdf(base64String, fileName) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
  }

  onClickDownloadPdf(){
    let base64String = this.base64;
    this.downloadPdf(base64String,"Factura "+this.refNumber);
  }

}
