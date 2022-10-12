import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentoModel } from '../models/documento.mode';
import { DocumentoService } from '../services/documento.service';
import { DocumentoDialogComponent } from './documento-dialog/documento-dialog.component';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {
  Documentos: DocumentoModel[]
  dataSource = new MatTableDataSource()
  displayedColumns = [
    { key: 'titulo', titulo: 'Documento' },
    { key: 'sigla', titulo: 'Sigla' },
    { key: 'funcion', titulo: 'Funcion' },
    { key: 'activo', titulo: 'Situacion' },
  ]
  opciones = ['editar', 'eliminar', 'habilitar']

  constructor(private documentoService: DocumentoService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.documentoService.getDocumentos().subscribe(doc => {
      this.Documentos = doc
      this.dataSource.data = this.Documentos
    })
  }

  crear_documento() {
    const dialogRef = this.dialog.open(DocumentoDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.Documentos.push(result)
        this.dataSource.data = this.Documentos
      }
    });
  }

  editar_documento(data: any) {
    const dialogRef = this.dialog.open(DocumentoDialogComponent, {
      data
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const indexFound = this.Documentos.findIndex(item => item.id_documento == data.id_documento)
        this.Documentos[indexFound] = Object.assign(data, result)
        this.dataSource.data = this.Documentos

      }
    });
  }
  eliminar_documento(data: any) {
    this.documentoService.updateDocumento(data.id_documento, { activo: false }).subscribe(cambios => {
      const indexFound = this.Documentos.findIndex(item => item.id_documento == data.id_documento)
      this.Documentos[indexFound].activo = false
      this.dataSource.data = this.Documentos
    })

  }
  habilitar_documento(data: any) {
    this.documentoService.updateDocumento(data.id_documento, { activo: true }).subscribe(cambios => {
      const indexFound = this.Documentos.findIndex(item => item.id_documento == data.id_documento)
      this.Documentos[indexFound].activo = true
      this.dataSource.data = this.Documentos
    })

  }

}
