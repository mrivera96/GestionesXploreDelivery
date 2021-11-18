import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ErrorModalComponent } from 'src/app/shared/components/error-modal/error-modal.component';
import { LoadingDialogComponent } from 'src/app/shared/components/loading-dialog/loading-dialog.component';
import { Card } from 'src/app/models/card';
import { CardsService } from 'src/app/services/cards.service';
import { CreateCardComponent } from '../create-card/create-card.component';
import { UpdateCardComponent } from '../update-card/update-card.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SuccessModalComponent } from 'src/app/shared/components/success-modal/success-modal.component';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-read-cards',
  templateUrl: './read-cards.component.html',
  styles: [],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ReadCardsComponent implements OnInit {
  myCards: Card[];
  dtOptions;
  dtTrigger: Subject<any>;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(private cardsService: CardsService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.initialize();
    this.loadData();
  }

  initialize() {
    this.dtTrigger = new Subject<any>();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false,
      processing: true,
      info: true,
      rowReorder: false,
      order: [0, 'asc'],
      responsive: true,
      language: {
        emptyTable: 'No hay datos para mostrar en esta tabla',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.',
        },
      },
    };
  }

  loadData() {
    this.openLoader();
    const cardsSubsc = this.cardsService
      .getMyPaymetMethods()
      .subscribe((response) => {
        this.myCards = response.data;
        this.dtTrigger.next();
        this.myCards.forEach((card) => {
          card.mes = +card.vencimiento.substring(0, 2);
          card.anio = +card.vencimiento.substring(2, 4);
          const visibleDigits = 4;
          let maskedSection = card.token_card.slice(0, -visibleDigits);
          let visibleSection = card.token_card.slice(-visibleDigits);
          card.visibleNumber = maskedSection.replace(/./g, '*') + visibleSection;
        });
        this.dialog.closeAll();
        cardsSubsc.unsubscribe();
      });
  }

  openErrorDialog(error: string, reload: boolean): void {
    const dialog = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    if (reload) {
      dialog.afterClosed().subscribe((result) => {
        this.dialog.closeAll();
        this.ngOnInit;
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
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.loadData();
      });
    });
  }

  editCard(card) {
    const dialRef = this.dialog.open(UpdateCardComponent, {
      data: {
        card: card,
      },
    });

    dialRef.afterClosed().subscribe((res) => {
      if (res) {
        location.reload();
      }
    });
  }

  deleteCard(card) {
    this.openLoader();
    const cardsSubsc = this.cardsService.deleteCard(card.idFormaPago).subscribe(
      (response) => {
        this.dialog.closeAll();
        this.openSuccessDialog(
          'Operacion Realizada Correctamente',
          response.message
        );
        cardsSubsc.unsubscribe();
      },
      (error) => {
        error.subscribe((err) => {
          this.openErrorDialog(err.statusText, false);
          cardsSubsc.unsubscribe();
        });
      }
    );
  }

  openConfirmDelete(card) {
    const dialRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        icon: 'warning',
        question: '¿Está seguro de eliminar esta tarjeta?',
      },
    });

    dialRef.afterClosed().subscribe((res) => {
      if (res) {
        this.deleteCard(card);
      }
    });
  }

  createCard() {
    const dialRef = this.dialog.open(CreateCardComponent);
    dialRef.afterClosed().subscribe((res) => {
      if (res) {
        location.reload();
      }
    });
  }

  openLoader() {
    const dialRef = this.dialog.open(LoadingDialogComponent);

    dialRef.afterClosed().subscribe((res) => {
      if (res) {
        location.reload();
      }
    });
  }
}
