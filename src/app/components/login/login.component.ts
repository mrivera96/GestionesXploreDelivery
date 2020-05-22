import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  loading = false
  submitted = false
  returnUrl: string
  error = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    // redirigir si el usuario está logueado
    if (this.authService.currentUserValue) {
      this.router.navigate([''])
    }
  }

  ngOnInit(): void {
    let nName = '';
    if (localStorage.getItem('remember_user')) {
      nName = localStorage.getItem('remember_user')
    }
    this.loginForm = new FormGroup({
      nickName: new FormControl(nName, [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember_me: new FormControl('')
    })


    // obtener la url de retorno desde los parámetros de la ruta o por defecto a '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
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
    this.authService.login(this.f.nickName.value, this.f.password.value)
      .subscribe(
        data => {
          if (data.error === 0) {
            const user = data.user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.authService.setCurrUser(user)
            this.router.navigate([this.returnUrl])
          } else if (data.error === 1) {
            this.error = data.message;
            $("#errModal").modal('show');
            this.loading = false;
          }

        })
  }

}
