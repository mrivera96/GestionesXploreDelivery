import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import validate = WebAssembly.validate;
import {MustMatch} from "../../../helpers/mustMatch.validator";
import {PasswordValidate} from "../../../helpers/passwordValidation.validator";

declare var $: any

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class CustomerProfileComponent implements OnInit {
  succsMsg
  errorMsg
  passChangeForm: FormGroup
  loaders = {
    loadingData: false,
    loadingSubmit: false
  }
  currentUser: User

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.passChangeForm = this.formBuilder.group({
      oldPass: ['', Validators.required],
      newPass: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPass: ['', [Validators.required]]
    }, {validator: [MustMatch('newPass', 'confirmNewPass'), PasswordValidate('newPass')]})
    this.currentUser = this.authService.currentUserValue
  }

  onFormSubmit() {
    if (this.passChangeForm.valid) {
      if (this.passChangeForm.get('newPass').value.includes(' ') || this.passChangeForm.get('confirmNewPass').value.includes(' ') || this.passChangeForm.get('oldPass').value.includes(' ')) {
        this.errorMsg = 'No se permiten espacios en blanco en las contraseñas.'
        $("#errModal").modal('show')
      } else {
        this.loaders.loadingSubmit = true
        this.usersService.changeCustomerPassword(this.passChangeForm.value).subscribe(response => {
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

  logout() {
    this.authService.logout().subscribe(data => {
      location.reload(true)
    })
  }

  cleanForm() {
    this.passChangeForm.reset()
  }

}
