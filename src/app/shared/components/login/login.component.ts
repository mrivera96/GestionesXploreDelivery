import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { BlankSpacesValidator } from '../../../helpers/blankSpaces.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  isMobile: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    // redirigir si el usuario está logueado
    if (this.authService.currentUserValue) {
      if (
        this.authService.currentUserValue.idPerfil === '1' ||
        this.authService.currentUserValue.idPerfil === '9'
      ) {
        this.router.navigate(['/admins/reservas-hoy']);
      } else if (
        this.authService.currentUserValue.idPerfil === '8' ||
        this.authService.currentUserValue.idPerfil === '12'
      ) {
        this.router.navigate(['/customers/dashboard']);
      }
    }
  }

  ngOnInit(): void {
    let nName = '';
    if (localStorage.getItem('remember_user')) {
      nName = localStorage.getItem('remember_user');
    }
    this.loginForm = this.formBuilder.group(
      {
        nickName: [nName, [Validators.required]],
        password: ['', [Validators.required]],
        remember_me: [''],
      },
      {
        validators: [
          BlankSpacesValidator('nickName'),
          BlankSpacesValidator('password'),
        ],
      }
    );
    if (window.screen.width < 1000) {
      this.isMobile = true;
    }
  }

  // getter para fácil acceso a los campos del formulario
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // detener aquí si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    if (this.f.remember_me.value) {
      localStorage.setItem('remember_user', this.f.nickName.value);
    }

    this.loading = true;
    const authSubscription = this.authService
      .login(this.f.nickName.value, this.f.password.value)
      .subscribe(
        (response) => {
          const user = response.user;
          localStorage.setItem('currentUserManagement', JSON.stringify(user));
          this.authService.setCurrUser(user);
          authSubscription.unsubscribe();
          this.router.navigate(['']);
        },
        (error) => {
          error.subscribe((error) => {
            this.error = error.statusText;
            this.openErrorDialog(this.error);
            this.loading = false;
            authSubscription.unsubscribe();
          });
        }
      );
  }

  openErrorDialog(error): void {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      data: {
        msgError: error,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialog.closeAll();
    });
  }
}
