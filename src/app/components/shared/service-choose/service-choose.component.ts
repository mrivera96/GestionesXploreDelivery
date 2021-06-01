import { Component, OnInit } from '@angular/core';
import {ServiceType} from "../../../models/service-type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ServiceTypeService} from "../../../services/service-type.service";

@Component({
  selector: 'app-service-choose',
  templateUrl: './service-choose.component.html',
  styleUrls: ['./service-choose.component.css']
})
export class ServiceChooseComponent implements OnInit {
  serviceTypes: ServiceType[]
  selectedServiceType: ServiceType
  constructor(
    public dialogRef: MatDialogRef<ServiceChooseComponent>,
    public dialog: MatDialog,
    private servTypesService: ServiceTypeService
  ) {
    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {

    this.loadData()
  }

  loadData() {
    const servTypeSubs = this.servTypesService.getServiceTypes()
      .subscribe(response => {
        this.serviceTypes = response.data
        servTypeSubs.unsubscribe()
      })
  }

  onFormSubmit(){

  }

}
