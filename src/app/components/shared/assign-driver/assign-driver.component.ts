import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {User} from 'src/app/models/user';
import {DeliveriesService} from 'src/app/services/deliveries.service';
import {UsersService} from 'src/app/services/users.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SuccessModalComponent} from '../success-modal/success-modal.component';
import {ErrorModalComponent} from '../error-modal/error-modal.component';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styles: []
})
export class AssignDriverComponent implements OnInit {
  asignForm: FormGroup
  loaders = {
    'loadingData': false
  }
  orderId
  conductores: User[]

  constructor(
    private deliveriesService: DeliveriesService,
    private usersService: UsersService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AssignDriverComponent>
  ) {
    this.orderId = data.order
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.asignForm = new FormGroup({
      idConductor: new FormControl(null, [Validators.required]),
    })

    const usersSubscription = this.usersService.getDrivers().subscribe(response => {
      this.conductores = response.data
      usersSubscription.unsubscribe()
    })
  }

  assignOrder() {
    if (this.asignForm.valid) {
      this.loaders.loadingData = true

      const deliveriesSubscription = this.deliveriesService.assigOrder(this.orderId, this.asignForm.get('idConductor').value).subscribe(response => {
        this.loaders.loadingData = false
        this.openSuccessDialog('Asignación de envío', response.data)
        deliveriesSubscription.unsubscribe()
      }, error => {
        error.subscribe(error => {
          this.openErrorDialog(error.statusText, false)
        })
        this.loaders.loadingData = false
        deliveriesSubscription.unsubscribe()
      })
    }
  }

  openSuccessDialog(succsTitle, succssMsg) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   location.reload(true)
    // })
  }

  openErrorDialog(error: string, reload: boolean): void {
    this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    })
  }
}