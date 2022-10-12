import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CuentaModel, UsuarioModel } from '../../models/usuario.model';
import { ConfiguracionesService } from '../../services/configuraciones.service';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.css']

})
export class UsuarioDialogComponent implements OnInit {
  Funcionario: UsuarioModel
  titulo: string = ""

  Form_Funcionario: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
    apellido_p: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
    apellido_m: [''],
    dni: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    telefono: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(9), Validators.pattern("^[0-9]*$")]],
    direccion: ['', Validators.required],
    expedido: ['', Validators.required]
  });
  expedido = this.configuracionesService.expedido //se obtiene por codido





  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioModel,
    public dialogRef: MatDialogRef<UsuarioDialogComponent>,
    private configuracionesService: ConfiguracionesService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion'
      this.Form_Funcionario.patchValue(this.data)
    }
    else {
      this.titulo = 'Registro'
    }
  }
  guardar() {
    if (this.data) {
      this.configuracionesService.editFuncionario(this.data.id_funcionario!, this.Form_Funcionario.value).subscribe(cambios => {
        this.Funcionario = Object.assign(this.data, cambios)
        this.dialogRef.close(this.Funcionario)
      })
    }
    else {
      this.configuracionesService.addFuncionario_Cuenta(this.Form_Funcionario.value, null).subscribe(data => {
        this.dialogRef.close(data.funcionario)
      })
    }
  }

  onNoClick() {
    this.dialogRef.close()
  }



  //Manejo de errores validacion
  get NombreErrorMessage(): string {
    const form = (this.Form_Funcionario.get('nombre') as FormControl);
    return form.hasError('required') ?
      'Ingrese la nombre' :
      form.hasError('pattern') ?
        'Solo letras' : ''
  }
  get ApellidoErrorMessage(): string {
    const form = (this.Form_Funcionario.get('apellido_p') as FormControl);
    return form.hasError('required') ?
      'Ingrese la apellido' :
      form.hasError('pattern') ?
        'Solo letras' : ''
  }
  get DniErrorMessage(): string {
    const form = (this.Form_Funcionario.get('dni') as FormControl);
    return form.hasError('required') ?
      'Ingrese la dni' :
      form.hasError('pattern') ?
        'Solo numeros' : ''
  }
  get TelefonoErrorMessage(): string {
    const form = (this.Form_Funcionario.get('telefono') as FormControl);
    return form.hasError('required') ?
      'Ingrese la telefono' :
      form.hasError('pattern') ?
        'Solo numeros' :
        form.hasError('minlength') ?
          'Ingrese un numero valido' :
          form.hasError('maxlength') ?
            'Ingrese un numero valido' : ''
  }

}
