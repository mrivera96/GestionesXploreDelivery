import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BlankSpacesValidator } from 'src/app/helpers/blankSpaces.validator';
import { MustMatch } from 'src/app/helpers/mustMatch.validator';
import { PasswordValidate } from 'src/app/helpers/passwordValidation.validator';
import { Customer } from 'src/app/models/customer';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { VerificationDialogComponent } from '../verification-dialog/verification-dialog.component';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: [],
})
export class SignUpComponent implements OnInit {
  newCustomer: Customer = {};
  phoneMask: any;
  nCustomerForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.initialize();
  }

  get controls() {
    return this.nCustomerForm.controls;
  }

  initialize() {
    this.nCustomerForm = this.formBuilder.group(
      {
        nomRepresentante: ['', [Validators.required, Validators.maxLength(80)]],
        numIdentificacion: [
          '',
          [
            Validators.required,
            Validators.maxLength(14),
            Validators.minLength(13),
          ],
        ],
        numTelefono: [
          '',
          [
            Validators.required,
            Validators.minLength(9),
            Validators.maxLength(9),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
            Validators.maxLength(50),
          ],
        ],
        newPass: ['', [Validators.required, Validators.minLength(8)]],
        confirmNewPass: ['', [Validators.required]],
      },
      {
        validator: [
          MustMatch('newPass', 'confirmNewPass'),
          PasswordValidate('newPass'),
          BlankSpacesValidator('newPass'),
        ],
      }
    );
  }

  phoneMasking(_event) {
    let event = _event?.target?.value;

    let newVal = event?.replace(/\D/g, '');
    /*if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }*/
    if (newVal?.length === 0) {
      newVal = '';
    } else if (newVal?.length > 4) {
      newVal = newVal.replace(/^(\d{0,4})(\d{0,4})/, '$1-$2');
    }

    this.controls.numTelefono.setValue(newVal);
  }

  dismissModal() {
    this.dialog.closeAll();
  }

  async openConfirmDialog() {
    const dialRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        icon: 'warning',
        question:
          '¿Tu número de teléfono es ' +
          this.controls.numTelefono.value +
          '? ' +
          ' Te enviaremos un código de verificación.',
      },
    });

    dialRef.afterClosed().subscribe((res) => {
      if (res) {
        this.confirmSignUp();
      }
    });
  }

  confirmSignUp() {
    const data = {
      form: this.nCustomerForm.value,
      code: this.generateCode(),
    };
    const ref = this.dialog.open(VerificationDialogComponent, { data: data });

    ref.afterClosed().subscribe((res) => {
      if (res) {
        this.formSubmit();
      } else {
        this.openErrorDialog(
          'El código ingresado no es correcto. Intenta nuevamente.'
        );
      }
    });
  }

  formSubmit() {
    this.loading = true;
    const authSubs = this.authService
      .signUp(this.nCustomerForm.value)
      .subscribe(
        (response) => {
          this.loading = false;
          this.openSuccessDialog(
            'Operación Realizada Correctamente',
            response.message
          );
          authSubs.unsubscribe();
        },
        (error) => {
          error.subscribe((error) => {
            this.loading = false;
            this.openErrorDialog(error.statusText);
            authSubs.unsubscribe();
          });
        }
      );
  }

  verifyMail() {
    const authSubs = this.authService
      .verifyMail(this.nCustomerForm.get('email').value)
      .subscribe((response) => {
        if (response.data == true) {
          this.nCustomerForm.controls.email.setErrors({ exists: true });
        } else {
          if (this.nCustomerForm.controls.email.hasError('exists')) {
            this.nCustomerForm.controls.email.setErrors({ exists: false });
          }
        }
        authSubs.unsubscribe();
      });
  }

  verifyNumber() {
    const authSubs = this.authService
      .verifyNumber(this.nCustomerForm.get('numTelefono').value)
      .subscribe((response) => {
        if (response.data == true) {
          this.nCustomerForm.controls.numTelefono.setErrors({ exists: true });
        } else {
          if (this.nCustomerForm.controls.numTelefono.hasError('exists')) {
            this.nCustomerForm.controls.numTelefono.setErrors({
              exists: false,
            });
          }
        }
        authSubs.unsubscribe();
      });
  }

  generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['login']);
    }); 
  }

  openErrorDialog(error: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
  }
}
