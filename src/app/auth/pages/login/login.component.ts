import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { fadeInDownOnEnterAnimation } from 'angular-animations';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations:[
    fadeInDownOnEnterAnimation()
  ]
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    remember: [false]
  })
  recordar_user: string
  constructor(private loginService: LoginService, private router: Router, private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.recordar_user = localStorage.getItem('login') || ''
    if (this.recordar_user.length > 0) {
      this.loginForm.controls['remember'].setValue(true)
      this.loginForm.controls['login'].setValue(this.recordar_user)
    }
  }
  login() {
    if (this.loginForm.invalid) {
      return
    }

    this.loginService.login(this.loginForm.value!, this.loginForm.get('remember')?.value!).subscribe(permiso=>{
      if(permiso==="admin_rol"){
        this.router.navigate(['/home'])
      }
      else{
        this.router.navigate(['/home', 'tramites-internos'])
      }
    })
  }

}
