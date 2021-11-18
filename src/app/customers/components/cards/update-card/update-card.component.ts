import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { Card } from 'src/app/models/card';
import { CardsService } from 'src/app/services/cards.service';
import { CardExpirationValidate } from 'src/app/helpers/cardExp.validator';

@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styles: [],
})
export class UpdateCardComponent implements OnInit {
  currentCard: Card;
  loaders = {
    loadingSubmit: false,
  };
  edCardForm: FormGroup;

  constructor(
    private cardsService: CardsService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateCardComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.dialogRef.disableClose = true;
    this.currentCard = this.data.card;
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.edCardForm = this.formBuilder.group(
      {
        cardId: this.currentCard.idFormaPago,
        expDate: [this.currentCard.vencimiento, Validators.required],
        alias: [
          this.currentCard.alias,
          [Validators.required, Validators.maxLength(30)],
        ],
      },
      { validators: [CardExpirationValidate('expDate')] }
    );
  }

  onFormSubmit() {
    if (this.edCardForm.valid) {
      this.loaders.loadingSubmit = true;
      const cardsSubsc = this.cardsService
        .editPaymentMethod(this.edCardForm.value)
        .subscribe(
          (response) => {
            this.openSuccessDialog(
              'Operación Realizada Correctamente',
              response.message
            );
            cardsSubsc.unsubscribe();
          },
          (error) => {
            error.subscribe((err) => {
              this.openErrorDialog(err.statusText);
              this.loaders.loadingSubmit = false;
              cardsSubsc.unsubscribe();
            });
          }
        );
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
