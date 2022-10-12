import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CuentaModel_View } from '../models/usuario.model';
import { ConfiguracionesService } from '../services/configuraciones.service';
import { CuentaDialogComponent } from './cuenta-dialog/cuenta-dialog.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {
  Cuentas: CuentaModel_View[] = []
  Total: number = 0
  dataSource = new MatTableDataSource()
  displayedColumns = [
    // { key: 'dni', titulo: 'Dni' },
    { key: 'funcionario', titulo: 'Asignacion' },
    { key: 'cargo', titulo: 'Cargo' },
    { key: 'dependencia', titulo: 'Dependencia' },
    { key: 'sigla_institucion', titulo: 'Institucion' },
    { key: 'activo', titulo: 'Situacion' },
  ]
  opciones = ['editar', 'eliminar', 'habilitar', 'desvincular']
  paginator: number = 0
  items_page: number = 10
  termino_busqueda: string = ""
  asignadas: 1 | 0 = 1
  constructor(private configuracionesService: ConfiguracionesService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.obtener_cuentas()
  }


  obtener_cuentas() {
    this.configuracionesService.getCuentas(this.paginator, this.items_page, this.asignadas).subscribe(data => {
      this.Cuentas = data.cuentas
      this.Total = data.total
      this.dataSource.data = this.Cuentas
    })
  }
  crear_cuenta() {
    let dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Cuentas.unshift(result)
        if (this.items_page < this.Total) {
          this.Cuentas.pop()
        }
        this.dataSource.data = this.Cuentas
        this.Total = this.Total + 1
      }
    });

  }

  editar_cuenta(data: any) {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1200px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const indexFound = this.Cuentas.findIndex((item: CuentaModel_View) => item.id_cuenta == data.id_cuenta);
        this.Cuentas[indexFound] = Object.assign(data, result)
        this.dataSource.data = this.Cuentas
      }
    });

  }
  habilitar_cuenta(data: any) {


  }
  eliminar_cuenta(data: any) {

  }

  desvincular_cuenta(data: any) {
    Swal.fire({
      title: 'Esta seguro de desvincular?',
      text: `El funcionario ${data.funcionario} dejara de ser el propietario de la cuenta ${data.cargo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desvincular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.configuracionesService.desvincular_cuenta(data.id_cuenta).subscribe(message => {
          this.obtener_cuentas()
          // this.Funcionarios = this.Funcionarios.filter(funcio => funcio.id_funcionario != funcionario.id_funcionario)
          Swal.fire(
            'Desvinculada',
            message,
            'success'
          )
        })

      }
    })

  }

  cambiar_tipo(tipo: 1 | 0) {
    this.asignadas = tipo
    if (this.asignadas == 1) {
      this.displayedColumns = [
        { key: 'dni', titulo: 'Dni' },
        { key: 'funcionario', titulo: 'Asignacion' },
        { key: 'cargo', titulo: 'Cargo' },
        { key: 'dependencia', titulo: 'Dependencia' },
        { key: 'sigla_institucion', titulo: 'Institucion' },
        { key: 'activo', titulo: 'Situacion' }
      ]

    }
    else {
      this.displayedColumns = [
        { key: 'cargo', titulo: 'Cargo' },
        { key: 'dependencia', titulo: 'Dependencia' },
        { key: 'sigla_institucion', titulo: 'Institucion' },
        { key: 'activo', titulo: 'Situacion' },
      ]

    }
    this.obtener_cuentas()
  }

  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_cuentas()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.configuracionesService.searchCuentas(filterValue, this.asignadas).subscribe(cuentas => {
        this.Cuentas = cuentas
        this.dataSource.data = this.Cuentas
        this.Total = this.Cuentas.length
      })
    }
    else {
      this.obtener_cuentas()
    }
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
    this.obtener_cuentas()

  }

}
