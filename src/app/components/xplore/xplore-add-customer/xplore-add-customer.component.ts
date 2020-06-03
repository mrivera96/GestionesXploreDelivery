import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {UsersService} from "../../../services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

declare var $: any

@Component({
  selector: 'app-xplore-add-customer',
  templateUrl: './xplore-add-customer.component.html',
  styleUrls: ['./xplore-add-customer.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class XploreAddCustomerComponent implements OnInit {
  succsMsg
  errorMsg
  nCustomerForm: FormGroup
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.nCustomerForm = this.formBuilder.group({
      nomEmpresa: ['', Validators.required],
      nomRepresentante: ['', Validators.required],
      numIdentificacion: ['', Validators.required],
      numTelefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    })
  }

  // getter para fácil acceso a los campos del formulario
  get f() {
    return this.nCustomerForm.controls;
  }

  reloadPage() {
    this.ngOnInit()
  }

  clearForm() {
    this.nCustomerForm.reset()
  }

  onFormSubmit() {
    if (this.nCustomerForm.valid) {
      this.loaders.loadingSubmit = true
      this.usersService.addCustomer(this.nCustomerForm.value).subscribe(response => {
        this.loaders.loadingSubmit = false
        this.succsMsg = response.message
        $("#succsModal").modal('show')
      }, error => {
        error.subscribe(error => {
          this.loaders.loadingSubmit = false
          this.errorMsg = error.statusText
          $("#errModal").modal('show')
        })
      })
    }
  }


}
