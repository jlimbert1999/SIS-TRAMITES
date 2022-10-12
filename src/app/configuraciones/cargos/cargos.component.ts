import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CargoModel } from '../models/cargo.model';
import { CargoService } from '../services/cargo.service';
import { CargosDialogComponent } from './cargos-dialog/cargos-dialog.component';
import { fadeInOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500})
  ]
})
export class CargosComponent implements OnInit {
  dataSource = new MatTableDataSource()
  Cargos: CargoModel[]
  Total: number = 0
  paginator: number = 0
  items_page: number = 10
  displayedColumns = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'activo', titulo: 'Situacion' },
  ]
  opciones = ['editar', 'eliminar', 'habilitar']
  termino_busqueda: string = ""
  cargando: boolean = false
  constructor(
    private cargoService: CargoService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.obtener_cargos()
  }
  obtener_cargos() {
    this.cargando = true
    this.cargoService.getCargos(this.paginator, this.items_page).subscribe(cargosdb => {
      this.Cargos = cargosdb.cargos
      this.Total = cargosdb.total
      this.dataSource.data = this.Cargos
      this.cargando = false
    })

  }


  crear_cargo() {
    const dialogRef = this.dialog.open(CargosDialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargoService.addCargo(result).subscribe(cargo => {
          this.Cargos.unshift(cargo)
          if (this.items_page < this.Total) {
            // mantener paginacion en 10 elementos por default
            this.Cargos.pop()
          }
          this.dataSource.data = this.Cargos
          this.Total = this.Total + 1
        })

      }
    });
  }
  editar_cargo(data: any) {
    const dialogRef = this.dialog.open(CargosDialogComponent, {
      width: '500px',
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargoService.editCargo(data.id_cargo, result).subscribe(cambios => {
          const indexFound = this.Cargos.findIndex((item: CargoModel) => item.id_cargo === data.id_cargo);
          if (indexFound != -1) {
            this.Cargos[indexFound] = Object.assign(data, cambios)
          }
        })
      }
    });
  }
  eliminar_cargo(data: any) {
    this.cargoService.deleteCargo(data.id_cargo).subscribe(message => {
      const indexFound = this.Cargos.map(e => e.id_cargo).indexOf(data.id_cargo);
      this.Cargos[indexFound].activo = false
    })
  }
  habilitar_cargo(data: any) {
    this.cargoService.habilitarCargo(data.id_cargo).subscribe(cambios => {
      const indexFound = this.Cargos.findIndex((item: CargoModel) => item.id_cargo === data.id_cargo);
      this.Cargos[indexFound].activo = true
    })
  }
  buscar_cargos(termino: string) {
    this.cargoService.searchCargos(termino).subscribe(cargos => {
      this.Cargos = cargos
      this.dataSource.data = cargos
      this.Total = cargos.length
    })
  }

  cambiar_paginacion(evento: any) {
    if (evento.pageSize > this.Total) {
      return
    }
    this.items_page = evento.pageSize
    if (evento.pageIndex > evento.previousPageIndex) {
      this.paginator = this.paginator + this.items_page
    }
    else if (evento.pageIndex < evento.previousPageIndex) {

      this.paginator = this.paginator - this.items_page
      if (this.paginator < 0) {
        this.paginator = 0
      }
    }
    this.obtener_cargos()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.cargoService.searchCargos(filterValue).subscribe(cargos => {
        this.Cargos = cargos
        this.dataSource.data = this.Cargos
        this.Total = this.Cargos.length
      })
    }
    else {
      this.obtener_cargos()
    }
  }

  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_cargos()
  }





}
