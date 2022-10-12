import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TiposTramitesService } from '../../services/tipos-tramites.service';

@Component({
  selector: 'app-dialog-tramite-requisitos',
  templateUrl: './dialog-tramite-requisitos.component.html',
  styleUrls: ['./dialog-tramite-requisitos.component.css']
})
export class DialogTramiteRequisitosComponent implements OnInit {
  titulo_dialog: string = ''
  TiposDoc: any[] = []
  Form_requerimiento: FormGroup = this.fb.group({
    detalle: ['', Validators.required],
    tipo_documento: ['', Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public requisito: any,
    private tiposTramitesService: TiposTramitesService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogTramiteRequisitosComponent>
  ) { }

  ngOnInit(): void {
    this.tiposTramitesService.getClasificacion_Requisitos().subscribe((resp: any) => {
      //metodo puede llegar a tardar
      if (resp.ok) {
        this.TiposDoc = resp.clasificacion
      }
    })
    if (this.requisito) {
      this.titulo_dialog = 'Edicion'
      this.Form_requerimiento.patchValue(this.requisito)
    }
    else {
      this.titulo_dialog = 'Registro'
    }
  }
  guardar() {
    if (this.Form_requerimiento.valid) {

      this.requisito = this.Form_requerimiento.value
      this.dialogRef.close(this.requisito)
    }

  }

}
