import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Card } from 'src/app/models/card';
import { AuthService } from 'src/app/services/auth.service';
import { CardsService } from 'src/app/services/cards.service';
import { PaymentsService } from 'src/app/services/payments.service';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { SuccessModalComponent } from '../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-balance-payment',
  templateUrl: './balance-payment.component.html',
  styles: [],
})
export class BalancePaymentComponent implements OnInit {
  loaders = {
    loadingSubmit: false,
  };
  myCards: Card[];
  selectedCard: Card;
  amountToPay: number;
  paymentType: number;
  currentBalance: number;
  paymentError = false;

  constructor(
    private cardsService: CardsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<BalancePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private paymentsService: PaymentsService,
    private authService: AuthService
  ) {
    this.amountToPay = this.data.payment;
    this.currentBalance = this.data.payment;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize() {
    this.selectedCard = {
      idFormaPago: 0,
      token_card: '',
      idCliente: 0,
    };
  }

  loadData() {
    this.loaders.loadingSubmit = true;
    const cardsSubsc = this.cardsService
      .getMyPaymetMethods()
      .subscribe((response) => {
        this.myCards = response.data;
        this.loaders.loadingSubmit = false;
        cardsSubsc.unsubscribe();
      });
  }

  autorizePayment() {
    this.loaders.loadingSubmit = true;
    const paymentObject = {
      cardNumber: this.selectedCard.token_card,
      expDate: this.selectedCard.vencimiento,
      cvv: this.selectedCard.cvv,
      amount: this.amountToPay,
    };

    this.cardsService.autorizePayment(paymentObject).subscribe(
      (response) => {
        const transactionDetails = {
          reasonCode: response.CreditCardTransactionResults.ReasonCode,
          reasonCodeDescription:
            response.CreditCardTransactionResults.ReasonCodeDescription,
          authCode: response.CreditCardTransactionResults.AuthCode,
          orderNumber: response.OrderNumber,
          merchantId: response.MerchantId,
          originalResponseCode:
            response.CreditCardTransactionResults.OriginalResponseCode,
          referenceNumber:
            response.CreditCardTransactionResults.ReferenceNumber,
          signature: response.Signature,
        };

        if (
          response.CreditCardTransactionResults.ReasonCode == 1 &&
          response.CreditCardTransactionResults.ResponseCode == 1
        ) {
          const transDetails = {
            fechaPago: new Date(),
            monto: this.amountToPay,
            tipoPago: 6,
            idCliente: this.authService.currentUserValue.idCliente,
            numAutorizacion: response.CreditCardTransactionResults.AuthCode,
          };

          this.cardsService
            .saveFailTransaction(transactionDetails)
            .subscribe(() => {
              this.paymentsService.addPayment(transDetails).subscribe(
                (response) => {
                  this.loaders.loadingSubmit = false;
                  this.openSuccessDialog(
                    'Operación Realizada Correctamente',
                    response.message
                  );
                },
                (error) => {
                  error.subscribe((err) => {
                    this.openErrorDialog(err.statusText);
                    this.loaders.loadingSubmit = false;
                  });
                }
              );
            });
        } else {
          this.paymentError = true;
          this.cardsService
            .saveFailTransaction(transactionDetails)
            .subscribe((response) => {
              this.loaders.loadingSubmit = false;
            });
        }
      },
      (error) => {
        error.subscribe((err) => {
          this.openErrorDialog(err.statusText);
          this.loaders.loadingSubmit = false;
        });
      }
    );
  }

  openErrorDialog(error: string): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });
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
}
