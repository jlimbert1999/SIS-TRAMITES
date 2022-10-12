import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-institucion-dialog',
  templateUrl: './institucion-dialog.component.html',
  styleUrls: ['./institucion-dialog.component.css']
})
export class InstitucionDialogComponent implements OnInit {
  titulo: string = ''
  Form_Institucion: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required]
  });
  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string },
    public dialogRef: MatDialogRef<InstitucionDialogComponent>
  ) { }

  ngOnInit(): void {
    if (!this.data) {
      this.titulo = "Registro"
    }
    else {
      this.titulo = "Edicion"
      this.Form_Institucion.patchValue(this.data)
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  guardar() {
    this.data = this.Form_Institucion.value
    this.dialogRef.close(this.data)

  }

  get errorMessage(): string {
    const form = (this.Form_Institucion.get('sigla') as FormControl);
    return form.hasError('required') ?
      'Ingrese la sigla' :
      form.hasError('maxlength') ?
        'Maximo 10 caracteres' : ''

  }

}
