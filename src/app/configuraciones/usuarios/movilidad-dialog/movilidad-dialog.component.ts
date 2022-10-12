import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioModel } from '../../models/usuario.model';
import { ConfiguracionesService } from '../../services/configuraciones.service';

@Component({
  selector: 'app-movilidad-dialog',
  templateUrl: './movilidad-dialog.component.html',
  styleUrls: ['./movilidad-dialog.component.css']
})
export class MovilidadDialogComponent implements OnInit {
  detalles:any = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UsuarioModel,
    private configuracionesService: ConfiguracionesService
  ) { }

  ngOnInit(): void {
    this.configuracionesService.getMovilidad_Funcional(this.data.id_funcionario!).subscribe(detalles => {
      this.detalles = detalles
    })
  }

}
