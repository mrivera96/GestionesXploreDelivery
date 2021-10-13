import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-create-card',
  templateUrl: './create-card.component.html',
  styles: [],
})
export class CreateCardComponent implements OnInit {
  newCardForm: FormGroup;
  loaders = {
    loadingSubmit: false,
  };
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private cardsService: CardsService,
    private authService: AuthService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateCardComponent>
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.newCardForm = this.formBuilder.group({
      idCliente: this.authService?.currentUserValue?.idCliente,
      cardNumber: [null, Validators.required],
      expDate: [null, Validators.required],
      cvv: [null, Validators.required],
      alias: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  onFormSubmit() {
    const cardObject = {
      cardNumber: this.token,
      expDate: this.newCardForm.get('expDate').value,
      cvv: this.newCardForm.get('cvv').value,
      alias: this.newCardForm.get('alias').value,
    };
    this.loaders.loadingSubmit = true;
    const cardSubs = this.cardsService
      .createPaymentMethod(cardObject)
      .subscribe(
        (response) => {
          cardSubs.unsubscribe();
          this.loaders.loadingSubmit = false;
          this.openSuccessDialog(
            'Operación realizada correctamente',
            response.message
          );
        },
        (error) => {
          error.subscribe((error) => {
            this.loaders.loadingSubmit = false;
            this.openErrorDialog(error.statusText);
          });
        }
      );
  }

  tokenize() {
    if (this.newCardForm.valid) {
      this.loaders.loadingSubmit = true;
      const cardSubsc = this.cardsService
        .tokenizeCard(this.newCardForm.value)
        .subscribe((response) => {
          if (response.Success == true) {
            this.token = response.Token;
            this.onFormSubmit();
          }
          this.loaders.loadingSubmit = false;
          cardSubsc.unsubscribe();
        });
    }
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef.close(true);
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
