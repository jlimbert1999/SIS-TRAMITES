import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  @Input() dataSource = new MatTableDataSource<any>();
  @Input() displayedColumns: any
  @Input() total_filas: number
  @Input() opciones: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  campos_tabla: string[]
  number_rows: number = 0

  //eventos botones
  @Output() eventoPaginacion: EventEmitter<any>;
  @Output() llamarEditar: EventEmitter<object>;
  @Output() llamarEliminar: EventEmitter<object>;
  @Output() llamarHabilitar: EventEmitter<object>;
  @Output() llamarDesvincular: EventEmitter<object>;
  @Output() llamarVerMovilidadFuncional: EventEmitter<object>;
  @Output() llamarImprimirFicha: EventEmitter<object>;
  @Output() llamarRemision: EventEmitter<object>;



  constructor() {
    this.llamarEditar = new EventEmitter();
    this.eventoPaginacion = new EventEmitter()
    this.llamarEliminar = new EventEmitter()
    this.llamarHabilitar = new EventEmitter()
    this.llamarDesvincular = new EventEmitter()
    this.llamarVerMovilidadFuncional = new EventEmitter()
    this.llamarImprimirFicha = new EventEmitter()
    this.llamarRemision = new EventEmitter()
  }

  ngOnInit(): void {

    // this.campos_tabla = this.displayedColumns.map((titulo: any) => titulo.key);
    // this.campos_tabla.push("opciones")

  }


  ngOnChanges(changes: SimpleChanges): void {
    this.number_rows = this.total_filas
    this.campos_tabla = this.displayedColumns.map((titulo: any) => titulo.key);
    this.campos_tabla.push("opciones")
    if (this.paginator) {
      this.paginator.firstPage()
    }


  }


  editarDatos(datos: object) {
    this.llamarEditar.emit(datos);
  }
  eliminarDatos(datos: object) {
    this.llamarEliminar.emit(datos);
  }
  getPageDetails(event: any) {
    this.eventoPaginacion.emit(event)
  }
  habilitarDatos(datos: object) {
    this.llamarHabilitar.emit(datos)
  }

  imprimirFicha(datos: object) {
    this.llamarImprimirFicha.emit(datos)
  }

  remitir(datos: any) {
    this.llamarRemision.emit(datos)
  }
 


  // METODOS PARA ADMINISTRACION DE CUENTAS
  desvincularCuenta(datos: object) {
    this.llamarDesvincular.emit(datos)
  }

  verMovilidadFuncional(datos: object) {
    this.llamarVerMovilidadFuncional.emit(datos)
  }



}



