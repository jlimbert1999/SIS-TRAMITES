import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cargos-dialog',
  templateUrl: './cargos-dialog.component.html',
  styleUrls: ['./cargos-dialog.component.css']
})
export class CargosDialogComponent implements OnInit {
  titulo: string = ""
  Form_Cargo: FormGroup = this.fb.group({
    nombre: ['', Validators.required]
  });
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string },
    public dialogRef: MatDialogRef<CargosDialogComponent>,
  ) { }

  ngOnInit(): void {
    if (!this.data) {
      this.titulo = "Registro"
    }
    else {
      this.titulo = "Edicion"
      this.Form_Cargo.patchValue(this.data)
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar() {
    this.data = this.Form_Cargo.value
    this.dialogRef.close(this.data)

  }

}
