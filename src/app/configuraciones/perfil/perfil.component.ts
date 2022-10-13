import { Component, OnInit } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { perfilModel } from '../models/usuario.model';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class PerfilComponent implements OnInit {
  detallesCuenta: perfilModel
  Form_Cuenta: FormGroup = this.fb.group({
    login: ['', Validators.required]
  })
  hide = true;
  actualizar_password: boolean = false
  mensaje_confirmacion: boolean = false

  constructor(
    private configuracionesService: ConfiguracionesService,
    private _location: Location,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configuracionesService.getDetallesCuenta().subscribe(cuenta => {
      this.detallesCuenta = cuenta
      this.Form_Cuenta.patchValue(cuenta)
    })
  }

  cambiar_formulario(value: boolean) {
    this.actualizar_password = value
    if (this.actualizar_password) {
      this.Form_Cuenta = this.fb.group({
        login: ['', Validators.required],
        password: ['', Validators.required]
      })

    }
    else {
      this.Form_Cuenta = this.fb.group({
        login: ['', Validators.required]
      })

    }
    this.Form_Cuenta.patchValue(this.detallesCuenta)
  }
  guardar() {
    if (this.Form_Cuenta.valid) {
      this.configuracionesService.putPerfil({ login: this.Form_Cuenta.get('login')?.value, password: this.Form_Cuenta.get('password')?.value }).subscribe(newLogin => {
        this.Form_Cuenta.get('login')?.setValue(newLogin)
        this.mensaje_confirmacion = true
      }, (error)=>{
        Swal.fire("Error al actualizar perfil", error.error.message, 'error')
      })
    }

  }

  regresar() {
    this._location.back();
  }

}
