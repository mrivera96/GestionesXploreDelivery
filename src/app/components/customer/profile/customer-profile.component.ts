import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UsersService} from "../../../services/users.service";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {MustMatch} from "../../../helpers/mustMatch.validator";
import {PasswordValidate} from "../../../helpers/passwordValidation.validator";
import {ErrorModalComponent} from "../../shared/error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../../shared/success-modal/success-modal.component";
import {BlankSpacesValidator} from "../../../helpers/blankSpaces.validator";

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
    private authService: AuthService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.passChangeForm = this.formBuilder.group({
      oldPass: ['', Validators.required],
      newPass: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPass: ['', [Validators.required]]
    }, {
      validator:
        [
          MustMatch('newPass', 'confirmNewPass'),
          PasswordValidate('newPass'),
          BlankSpacesValidator('newPass'),
        ]
    })
    this.currentUser = this.authService.currentUserValue
  }

  onFormSubmit() {
    if (this.passChangeForm.valid) {
      if (this.passChangeForm.get('newPass').value.includes(' ') || this.passChangeForm.get('confirmNewPass').value.includes(' ') || this.passChangeForm.get('oldPass').value.includes(' ')) {
        this.errorMsg = 'No se permiten espacios en blanco en las contraseñas.'
        this.openErrorDialog(this.errorMsg, false)
      } else {
        this.loaders.loadingSubmit = true
        const userSubscription = this.usersService.changeCustomerPassword(this.passChangeForm.value).subscribe(response => {
          this.loaders.loadingSubmit = false
          this.succsMsg = response.message
          this.openSuccessDialog('Operación Realizada Correctamente', this.succsMsg)
          userSubscription.unsubscribe()
        }, error => {
          error.subscribe(error => {
            this.loaders.loadingSubmit = false
            this.errorMsg = error.statusText
            this.openErrorDialog(this.errorMsg, false)
            userSubscription.unsubscribe()
          })
        })

      }

    }
  }

  logout() {
    const authSubscription = this.authService.logout().subscribe(data => {
      location.reload(true)
      authSubscription.unsubscribe()
    })
  }

  cleanForm() {
    this.passChangeForm.reset()
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.logout()
    })
  }

}
