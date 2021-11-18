import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verification-dialog',
  templateUrl: './verification-dialog.component.html',
  styles: [],
})
export class VerificationDialogComponent implements OnInit {
  confirmationCod = [];
  data: any;
  loading = false;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialogRef: MatDialogRef<VerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private dialData: any
  ) {
    this.dialogRef.disableClose = true;
    this.data = this.dialData;
  }

  ngOnInit(): void {
    this.sendCode();
  }

  sendCode() {
    const code = this.data.code;
    const codeSubsc = this.http
      .get(`${environment.apiUrl}`, {
        params: {
          function: 'sendSMS',
          telefono: this.data.form.numTelefono.replace('-', ''),
          sms: 'XPLORE DELIVERY: Tu codigo de verificacion es: ' + code,
        },
      })
      .subscribe(
        (response) => {
          codeSubsc.unsubscribe();
        },
        (error) => {
          codeSubsc.unsubscribe();
          console.log(error);
        }
      );
  }

  confirmCode() {
    if (this.confirmationCod.length == 4) {
      const vCode =
        this.confirmationCod[0] +
        '' +
        this.confirmationCod[1] +
        '' +
        this.confirmationCod[2] +
        '' +
        this.confirmationCod[3];

      if (vCode == this.data.code) {
        this.dialogRef.close(true);
      }else{
        this.dialogRef.close(false);
      }
    }
  }
}
