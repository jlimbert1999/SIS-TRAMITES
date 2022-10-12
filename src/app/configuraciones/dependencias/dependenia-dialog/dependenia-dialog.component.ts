import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DependenciaModel, DependenciaModel_View } from '../../models/dependencia.model';
import { DependenciaService } from '../../services/dependencia.service';

@Component({
  selector: 'app-dependenia-dialog',
  templateUrl: './dependenia-dialog.component.html',
  styleUrls: ['./dependenia-dialog.component.css']
})
export class DependeniaDialogComponent implements OnInit {
  titulo: string = ''
  Form_Dependencia: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    id_institucion: ['', Validators.required]
  });
  instituciones: { id_institucion: number, nombre: string, sigla: string }[] = []
  sigla_institucion: string = ""
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DependenciaModel_View,
    public dialogRef: MatDialogRef<DependeniaDialogComponent>,
    private dependenciaService: DependenciaService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.titulo = 'Edicion'
      this.sigla_institucion = this.data.institucion_sigla
      this.Form_Dependencia.patchValue(this.data)
    }
    else {

      this.titulo = 'Registro'
      this.dependenciaService.getInstituciones_Habilitadas().subscribe(inst => {
        this.instituciones = inst
      })

    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  guardar() {
    if (this.data) {
      this.dependenciaService.editDependencia(this.data.id_dependencia, { nombre: this.Form_Dependencia.get('nombre')?.value, sigla: this.Form_Dependencia.get('sigla')?.value }).subscribe(cambios => {
        this.dialogRef.close(cambios)
      })
    }
    else {
      this.dependenciaService.addDependencia(this.Form_Dependencia.value).subscribe(dependencia => {
        this.data = {
          id_dependencia: dependencia.id_institucion,
          nombre: dependencia.nombre,
          sigla: dependencia.sigla,
          id_institucion: dependencia.id_institucion,
          activo: dependencia.activo!,
          institucion_sigla: this.sigla_institucion
        }
        this.dialogRef.close(this.data)
      })
    }

  }


  get errorMessage(): string {
    const form = (this.Form_Dependencia.get('sigla') as FormControl);
    return form.hasError('required') ?
      'Ingrese la sigla' :
      form.hasError('maxlength') ?
        'Maximo 10 caracteres' : ''
  }

}
