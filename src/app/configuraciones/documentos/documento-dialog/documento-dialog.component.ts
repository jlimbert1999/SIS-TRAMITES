import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentoModel } from '../../models/documento.mode';
import { DocumentoService } from '../../services/documento.service';

@Component({
  selector: 'app-documento-dialog',
  templateUrl: './documento-dialog.component.html',
  styleUrls: ['./documento-dialog.component.css']
})
export class DocumentoDialogComponent implements OnInit {
  Form_Documento: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
    sigla: ['', Validators.required],
    funcion: ['', Validators.required]
  });

  Titulo: string
  constructor(@Inject(MAT_DIALOG_DATA) public data: DocumentoModel, private documentoService: DocumentoService, private fb: FormBuilder, public dialogRef: MatDialogRef<DocumentoDialogComponent>,) { }

  ngOnInit(): void {
    if (this.data) {
      this.Titulo = "Edicion"
      this.Form_Documento.patchValue(this.data)
    }
    else {
      this.Titulo = "Registro"
    }
  }

  guardar() {
    if (this.data) {
      this.documentoService.updateDocumento(this.data.id_documento!, this.Form_Documento.value).subscribe(cambios => {
        this.dialogRef.close(cambios)
      })
    }
    else {
      this.documentoService.addDocumento(this.Form_Documento.value).subscribe(doc => {
        this.dialogRef.close(doc)
      })

    }

  }

}
