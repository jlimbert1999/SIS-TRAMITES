import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TipoTramiteModel } from '../models/tipoTramite.model';
import { TiposTramitesService } from '../services/tipos-tramites.service';
import { DialogTiposTramitesComponent } from './dialog-tipos-tramites/dialog-tipos-tramites.component';

@Component({
  selector: 'app-tipos-tramites',
  templateUrl: './tipos-tramites.component.html',
  styleUrls: ['./tipos-tramites.component.css']
})
export class TiposTramitesComponent implements OnInit {
  dataSource = new MatTableDataSource()
  Tipos_Tramites: TipoTramiteModel[] = []
  Total: number = 0
  paginator: number = 0
  items_page: number = 10
  displayedColumns = [
    { key: 'titulo', titulo: 'Nombre' },
    { key: 'segmento', titulo: 'Segmento' },
    { key: 'sigla', titulo: 'Sigla' },
    { key: 'externo', titulo: 'Tipo' },
    { key: 'activo', titulo: 'Situacion' },

  ]
  opciones = ['editar', 'eliminar', 'habilitar']
  termino_busqueda: string = ""
  cargando: boolean = false
  segmentos: any[]

  constructor(private tiposTramitesService: TiposTramitesService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.obtener_tipos_tramites()
  }

  obtener_tipos_tramites() {
    this.tiposTramitesService.getTipos(this.paginator, this.items_page).subscribe(data => {
      this.Tipos_Tramites = data.tipos
      this.dataSource.data = this.Tipos_Tramites
      this.Total = data.total
      this.segmentos = data.segmentos
    })
  }

  crear_tipoTramite() {
    const dialogRef = this.dialog.open(DialogTiposTramitesComponent, {
      width: '900px',
      data: {
        tipo_tramite: null,
        segmentos: this.segmentos
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.tipo_tramite.activo = true
        if (!this.segmentos.includes(result.segmento.toUpperCase())) {
          this.segmentos.push({ segmento: result.segmento.toUpperCase() })
        }
        this.Tipos_Tramites.unshift(result.tipo_tramite)
        if (this.items_page < this.Total) {
          this.Tipos_Tramites.pop()
        }
        this.Total = this.Total + 1
        this.dataSource.data = this.Tipos_Tramites

      }
    });

  }
  eliminar_tipo(data: any) {
    this.tiposTramitesService.putTipo(data.id_TipoTramite, { activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        const indexFound = this.Tipos_Tramites.findIndex(tipo => tipo.id_TipoTramite === data.id_TipoTramite);
        this.Tipos_Tramites[indexFound].activo = false
      }
    })

  }
  editar_tipo(data: any) {
    data.externo = data.externo == 1 ? true : false
    const dialogRef = this.dialog.open(DialogTiposTramitesComponent, {
      width: '900px',
      data: {
        tipo_tramite: data,
        segmentos: this.segmentos
      }
    })
    dialogRef.afterClosed().subscribe(datosFormulario => {
      if (datosFormulario) {
        if (!this.segmentos.includes(datosFormulario.segmento.toUpperCase())) {
          this.segmentos.push({ segmento: datosFormulario.segmento.toUpperCase() })
        }
        const index = this.Tipos_Tramites.findIndex((item: TipoTramiteModel) => item.id_TipoTramite == datosFormulario.tipo_tramite.id_TipoTramite);
        this.Tipos_Tramites[index] = datosFormulario.tipo_tramite
        this.dataSource.data = this.Tipos_Tramites
      }
    })

  }
  habilitar_tipo(data: any) {
    this.tiposTramitesService.putTipo(data.id_TipoTramite, { activo: true }).subscribe((resp: any) => {
      if (resp.ok) {
        const indexFound = this.Tipos_Tramites.findIndex(tipo => tipo.id_TipoTramite === data.id_TipoTramite);
        this.Tipos_Tramites[indexFound].activo = true
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue !== '') {
      this.tiposTramitesService.searchTiposTramites(filterValue).subscribe(tipos => {
        this.Tipos_Tramites = tipos
        this.dataSource.data = this.Tipos_Tramites
        this.Total = this.Tipos_Tramites.length
      })
    }
    else {
      this.obtener_tipos_tramites()
    }
  }

  limpiar_busqueda() {
    this.paginator = 0
    this.termino_busqueda = ""
    this.obtener_tipos_tramites()
  }


  cambiar_paginacion(evento: any) {
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
    this.obtener_tipos_tramites()
  }

}
