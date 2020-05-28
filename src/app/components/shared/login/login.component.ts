import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {trigger, style, animate, transition} from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({opacity: 0}),
        animate(1000, style({opacity: 1}))
      ])
    ])
  ]
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

      if(this.authService.currentUserValue.idPerfil === "1"){
        this.router.navigate(['inicio'])
      }else if(this.authService.currentUserValue.idPerfil === "8"){
        this.router.navigate(['inicio-cliente'])
      }
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
        response => {
          const user = response.user;
          localStorage.setItem('currentUserManagement', JSON.stringify(user));
          this.authService.setCurrUser(user)
          this.router.navigate([''])
        }, error => {
          error.subscribe(error => {
            this.error = error.statusText
            $("#errModal").modal('show')
            this.loading = false
          })

        })
  }

}
