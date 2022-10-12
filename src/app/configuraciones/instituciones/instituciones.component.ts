import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { InstitucionModel } from '../models/institucion.mode';
import { InstitucionService } from '../services/institucion.service';
import { InstitucionDialogComponent } from './institucion-dialog/institucion-dialog.component';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500})
  ]
})
export class InstitucionesComponent implements OnInit {
  Instituciones: InstitucionModel[]
  Total: number = 0

  dataSource = new MatTableDataSource()
  displayedColumns = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'direccion', titulo: 'Direccion' },
    { key: 'sigla', titulo: 'Sigla' },
    { key: 'telefono', titulo: 'telefono' },
    { key: 'activo', titulo: 'Situacion' },
  ]
  opciones = ['editar', 'eliminar', 'habilitar']
  paginator: number = 0
  items_page: number = 10
  cargando: boolean = false
  termino_busqueda: string = ""

  constructor(
    private institucionService: InstitucionService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtener_instituciones()

  }
  obtener_instituciones() {
    this.institucionService.getInstituciones(this.paginator, this.items_page).subscribe(insti => {
      this.Instituciones = insti.instituciones
      this.Total = insti.total
      this.dataSource.data = this.Instituciones
    })
  }
  crear_institucion() {
    const dialogRef = this.dialog.open(InstitucionDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.institucionService.addInstitucion(result).subscribe(insti => {
          this.Instituciones.unshift(insti)
          if (this.items_page < this.Total) {
            this.Instituciones.pop()
          }
          this.dataSource.data = this.Instituciones
          this.Total = this.Total + 1
          this.obtener_instituciones()
        })

      }
    });

  }
  editar_institucion(data: any) {
    const dialogRef = this.dialog.open(InstitucionDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.institucionService.editInstitucion(data.id_institucion, result).subscribe(cambios => {
          const indexFound = this.Instituciones.findIndex((item: InstitucionModel) => item.id_institucion === data.id_institucion);
          this.Instituciones[indexFound] = Object.assign(data, cambios)
        })
      }
    });
  }

  eliminar_institucion(data: any) {
    this.institucionService.deleteInstictucion(data.id_institucion).subscribe(message => {
      const indexFound = this.Instituciones.findIndex((item: InstitucionModel) => item.id_institucion === data.id_institucion);
      this.Instituciones[indexFound].activo = false
    })
  }
  habilitar_institucion(data: any) {
    this.institucionService.habilitarInstitucin(data.id_institucion).subscribe(cambios => {
      const indexFound = this.Instituciones.findIndex((item: InstitucionModel) => item.id_institucion === data.id_institucion);
      this.Instituciones[indexFound].activo = true
    })
  }

  cambiar_institucion(evento: any) {
    this.items_page = evento.pageSize
    if (evento.pageIndex > evento.previousPageIndex) {
      this.paginator = this.paginator + 5
    }
    else if (evento.pageIndex < evento.previousPageIndex) {
      this.paginator = this.paginator - 5
      if (this.paginator < 0) {
        this.paginator = 0
      }
    }
    this.obtener_instituciones()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.institucionService.searchInstitucion(filterValue).subscribe(insti => {
        this.Instituciones = insti
        this.dataSource.data = this.Instituciones
        this.Total = this.Instituciones.length
      })
    }
    else {
      this.obtener_instituciones()
    }
  }

  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_instituciones()
  }



}
