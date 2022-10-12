import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DependenciaModel_View } from '../models/dependencia.model';
import { DependenciaService } from '../services/dependencia.service';
import { DependeniaDialogComponent } from './dependenia-dialog/dependenia-dialog.component';
import Swal from 'sweetalert2'
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500})
  ]
})
export class DependenciasComponent implements OnInit {
  Dependencias: DependenciaModel_View[] = []
  Total: number = 0
  dataSource = new MatTableDataSource()
  displayedColumns = [
    { key: 'sigla', titulo: 'Sigla' },
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'institucion_sigla', titulo: 'Institucion' },
    { key: 'activo', titulo: 'Situacion' },
  ]
  opciones = ['editar', 'eliminar', 'habilitar']
  paginator: number = 0
  items_page: number = 10
  termino_busqueda: string = ""
  constructor(public dialog: MatDialog, private dependenciaService: DependenciaService) { }

  ngOnInit(): void {
    this.obtener_dependencias()

  }

  obtener_dependencias() {
    this.dependenciaService.getDependencias(this.paginator, this.items_page).subscribe(dep => {
      this.Dependencias = dep.dependencias
      this.Total = dep.total
      this.dataSource.data = this.Dependencias
    })
  }

  crear_dependencia() {
    const dialogRef = this.dialog.open(DependeniaDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: DependenciaModel_View) => {
      if (result) {
        this.Dependencias.unshift(result)
        if (this.items_page < this.Total) {
          this.Dependencias.pop()
        }
        this.Total = this.Total + 1
        this.dataSource.data = this.Dependencias
      }
    });


  }

  editar_dependencia(data: any) {
    const dialogRef = this.dialog.open(DependeniaDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const indexFound = this.Dependencias.findIndex(item => item.id_dependencia = data.id_dependencia)
        this.Dependencias[indexFound] = Object.assign(data, result)
        this.dataSource.data = this.Dependencias



      }
    });
  }
  eliminar_dependencia(data: any) {
    Swal.fire({
      title: 'Esta seguro de eliminar?',
      text: "Esta opcion deshabilitara la dependencia, por lo que no sera visible para el resto de funcionarios",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'Cancelar',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dependenciaService.deleteDependencia(data.id_dependencia).subscribe(cambios => {
          const indexFound = this.Dependencias.findIndex(item => item.id_dependencia = data.id_dependencia)
          this.Dependencias[indexFound].activo = false
          this.dataSource.data = this.Dependencias
        })
      }
    })

  }
  habilitar_dependencia(data: any) {
    this.dependenciaService.habilitarDependencia(data.id_dependencia).subscribe(cambios => {
      const indexFound = this.Dependencias.findIndex(item => item.id_dependencia = data.id_dependencia)
      this.Dependencias[indexFound].activo = true
      this.dataSource.data = this.Dependencias
    })
  }

  cambiar_paginacion(evento: any) {
    if (evento.pageSize > this.Total) {
      return
    }
    this.items_page = evento.pageSize
    if (evento.pageIndex > evento.previousPageIndex) {
      this.paginator = this.paginator + 10
    }
    else if (evento.pageIndex < evento.previousPageIndex) {

      this.paginator = this.paginator - 10
      if (this.paginator < 0) {
        this.paginator = 0
      }
    }
    this.obtener_dependencias()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.dependenciaService.searchDepenedencias(filterValue).subscribe(dep => {
        this.Dependencias = dep
        this.dataSource.data = this.Dependencias
        this.Total = this.Dependencias.length
      })
    }
    else {
      this.paginator = 0
      this.obtener_dependencias()
    }
  }

  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_dependencias()
  }


}
