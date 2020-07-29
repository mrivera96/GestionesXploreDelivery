import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ErrorModalComponent} from "../error-modal/error-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {SuccessModalComponent} from "../success-modal/success-modal.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
})
export class PasswordRecoveryComponent implements OnInit {
  passRecForm: FormGroup
  loading: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initialize()
  }

  initialize() {
    this.passRecForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"),
        Validators.maxLength(50)]
      ],
      numIdentificacion: ['', [
        Validators.required,
        Validators.maxLength(14),
        Validators.minLength(13)]
      ]
    })
  }

  get f(){
    return this.passRecForm.controls
  }

  onFormSubmit() {
    if (this.passRecForm.valid) {
      this.loading = true
      this.authService.passwordRecovery(this.passRecForm.value).subscribe(response => {
        this.openSuccessDialog('Operación Realizada Correctamente', response.message)
        this.loading = false
      },error => {
        if(error.subscribe()){
          error.subscribe(error => {
            this.openErrorDialog(error.statusText)
          })
        }
      })
    }
  }

  openErrorDialog(error): void {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll()
    })
  }

  openSuccessDialog(succsTitle: string, succssMsg: string) {
    const dialogRef = this.dialog.open(SuccessModalComponent, {
      data: {
        succsTitle: succsTitle,
        succsMsg: succssMsg
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['login'])
    })
  }

}
