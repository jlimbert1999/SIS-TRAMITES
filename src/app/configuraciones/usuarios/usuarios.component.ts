import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioModel } from '../models/usuario.model';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { MovilidadDialogComponent } from './movilidad-dialog/movilidad-dialog.component';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  Funcionarios: UsuarioModel[]
  Total: number = 0
  dataSource = new MatTableDataSource()
  displayedColumns = [
    { key: 'nombre_completo', titulo: 'Nombre' },
    { key: 'dni', titulo: 'Dni' },
    { key: 'expedido_lugar', titulo: 'Expedido' },
    { key: 'telefono', titulo: 'Telefono' },
    { key: 'activo', titulo: 'Situacion' },
  ]
  opciones = ['editar', 'eliminar', 'habilitar', 'movilidad funcional']
  paginator: number = 0
  items_page: number = 10
  cargando: boolean = false
  termino_busqueda: string = ""

  constructor(
    private configuracionesService: ConfiguracionesService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtener_funcionarios()
  }
  obtener_funcionarios() {
    this.configuracionesService.getFuncionarios(undefined, undefined).subscribe(data => {
      this.Funcionarios = data.funcionarios
      this.Total = data.total
      this.dataSource.data = this.Funcionarios
    })
  }
  crear_funcionario() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Funcionarios.unshift(result)
        if (this.items_page < this.Total) {
          this.Funcionarios.pop()
        }
        this.Total = this.Total + 1
        this.dataSource.data = this.Funcionarios
      }
    });

  }
  editar_funcionario(data: any) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const indexFound = this.Funcionarios.findIndex((item: UsuarioModel) => item.id_funcionario === data.id_funcionario);
        this.Funcionarios[indexFound] = result
      }
    });

  }
  eliminar_funcionario(data: any) {
    this.configuracionesService.deleteFuncionario(data.id_funcionario).subscribe(message => {
      const indexFound = this.Funcionarios.findIndex((item: UsuarioModel) => item.id_funcionario === data.id_funcionario);
      this.Funcionarios[indexFound].activo = false
    })

  }
  habilitar_funcionario(data: any) {

  }
  ver_MovilidadFuncional(data: any) {
    const dialogRef = this.dialog.open(MovilidadDialogComponent, {
      data: data,
      width:'900px'
    });
   

  }

  cambiar_paginacion(evento: any) {
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
    this.obtener_funcionarios()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.configuracionesService.searchFuncionarios(filterValue).subscribe(func => {
        this.Funcionarios = func
        this.dataSource.data = this.Funcionarios
        this.Total = this.Funcionarios.length
      })
    }
    else {
      this.obtener_funcionarios()
    }
  }

  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_funcionarios()
  }

}
