import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RequerimientosModel, TipoTramiteModel } from '../../models/tipoTramite.model';
import { TiposTramitesService } from '../../services/tipos-tramites.service';
import { DialogTramiteRequisitosComponent } from '../dialog-tramite-requisitos/dialog-tramite-requisitos.component';

@Component({
  selector: 'app-dialog-tipos-tramites',
  templateUrl: './dialog-tipos-tramites.component.html',
  styleUrls: ['./dialog-tipos-tramites.component.css']
})
export class DialogTiposTramitesComponent implements OnInit {
  titulo: string
  Form_TipoTramite: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
    sigla: ['', Validators.required],
    segmento: ['', Validators.required],
    externo: [null, Validators.required]
  });
  isChecked: boolean = true
  Tipo_Tramite: TipoTramiteModel
  Requerimientos: RequerimientosModel[] = []
  displayedColumns: string[] = ['nro', 'descripcion', 'opciones'];
  spinner_carga: boolean = false
  filteredOptions: Observable<any[]>;
  Segmentos: any[]
  dataSource = new MatTableDataSource();
  VerHabilitados: boolean = true


  @ViewChild('tablaRequisitos') tablaRequisitos: any;  //observar cambios tabla

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { tipo_tramite: TipoTramiteModel, segmentos: { segmento: string }[] }, private tiposTramitesService: TiposTramitesService,
    public dialogRef: MatDialogRef<DialogTramiteRequisitosComponent>,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.Segmentos = this.data.segmentos
    this.filteredOptions = this.Form_TipoTramite.controls['segmento'].valueChanges.pipe(
      startWith(''),
      map(elemento => (elemento ? this._filter(elemento) : this.Segmentos.slice())));

    if (this.data.tipo_tramite == null) {
      this.titulo = "Registro"
    } else {
      this.titulo = "Edicion"
      this.Form_TipoTramite.patchValue(this.data.tipo_tramite)
      this.tiposTramitesService.getRequerimientos(this.data.tipo_tramite.id_TipoTramite!).subscribe((resp: any) => {
        ;
        if (resp.ok) {
          this.Requerimientos = resp.requerimientos
          this.alternar_vista_requerimientos(true)
        }
      })
    }
  }

  guardar_datos() {

    if (this.titulo == "Registro") {
      this.Tipo_Tramite = this.Form_TipoTramite.value
      if (this.Tipo_Tramite.externo == false) {
        this.Requerimientos = []
      }
      this.tiposTramitesService.addTipo(this.Tipo_Tramite, this.Requerimientos).subscribe((resp: any) => {
        if (resp.ok) {
          this.Tipo_Tramite.id_TipoTramite = resp.id_TipoTramite
          this.dialogRef.close({ tipo_tramite: this.Tipo_Tramite, segmento: this.Form_TipoTramite.controls['segmento'].value })
        }
      })
    }
    else if (this.titulo == "Edicion") {
      let cambios: object = {}
      Object.keys(this.Form_TipoTramite.controls).forEach((key: string) => {
        if (this.Form_TipoTramite.get(key)?.dirty) {
          Object.assign(cambios, { [key]: this.Form_TipoTramite.controls[key].value })
        }
      })
      if (Object.keys(cambios).length > 0) {
        this.tiposTramitesService.putTipo(this.data.tipo_tramite.id_TipoTramite!, cambios).subscribe((resp: any) => {
          if (resp.ok) {
            Object.assign(this.data.tipo_tramite, cambios)
            this.dialogRef.close({ tipo_tramite: this.data.tipo_tramite, segmento: this.Form_TipoTramite.controls['segmento'].value })
          }
        })
      }
      else {
        this.dialogRef.close()
      }
    }

  }

  agregar_requisito() {
    const dialogRef = this.dialog.open(DialogTramiteRequisitosComponent, {
      width: '500px',
      data: null
    })
    dialogRef.afterClosed().subscribe((dataDialog: any) => {
      if (dataDialog) {
        let requerimiento: RequerimientosModel = {
          detalle: dataDialog.detalle,
          tipo_documento: dataDialog.tipo_documento,
          activo: true
        }
        if (this.titulo == "Registro") {
          this.Requerimientos.push(requerimiento)
          this.dataSource.data = this.Requerimientos
        }
        else if (this.titulo == "Edicion") {
          requerimiento.id_TipoTramite = this.data.tipo_tramite.id_TipoTramite
          this.tiposTramitesService.addRequerimiento(requerimiento).subscribe((resp: any) => {
            if (resp.ok) {
              requerimiento.id_requerimiento = resp.id_requerimiento
              this.Requerimientos.push(requerimiento)
              this.alternar_vista_requerimientos(this.isChecked)
            }
          })
        }
      }
    })
  }

  editar_Requisito(datosRequerimiento: RequerimientosModel) {
    const dialogRef = this.dialog.open(DialogTramiteRequisitosComponent, {
      width: '500px',
      data: datosRequerimiento
    })
    dialogRef.afterClosed().subscribe(dataDialog => {
      if (dataDialog) {
        this.tiposTramitesService.putRequerimientos(datosRequerimiento.id_requerimiento!, dataDialog).subscribe((resp: any) => {
          if (resp.ok) {
            Object.assign(datosRequerimiento, dataDialog)
            const index = this.Requerimientos.findIndex((item: RequerimientosModel) => item.id_requerimiento == datosRequerimiento.id_requerimiento);
            this.Requerimientos[index] = datosRequerimiento
            this.alternar_vista_requerimientos(this.isChecked)
          }
        })
      }
    })
  }
  eliminar_Requisito(datosRequerimiento: RequerimientosModel) {
    this.tiposTramitesService.putRequerimientos(datosRequerimiento.id_requerimiento!, { activo: false }).subscribe((resp: any) => {
      if (resp.ok) {
        const index = this.Requerimientos.findIndex((item: RequerimientosModel) => item.id_requerimiento == datosRequerimiento.id_requerimiento);
        this.Requerimientos[index].activo = false
        this.alternar_vista_requerimientos(this.isChecked)
      }
    })
  }
  habilitar_Requisito(datosRequerimiento: RequerimientosModel) {
    this.tiposTramitesService.putRequerimientos(datosRequerimiento.id_requerimiento!, { activo: true }).subscribe((resp: any) => {
      if (resp.ok) {
        const index = this.Requerimientos.findIndex((item: RequerimientosModel) => item.id_requerimiento == datosRequerimiento.id_requerimiento);
        this.Requerimientos[index].activo = true
        this.alternar_vista_requerimientos(this.isChecked)
      }
    })

  }

  quitar_Requisito(posicion: number) {
    this.Requerimientos.splice(posicion, 1);
    this.dataSource.data = this.Requerimientos
  }

  alternar_vista_requerimientos(habilitados: boolean) {
    // false:mostrar habilitados true: mostrar no habilitados
    this.isChecked = habilitados
    this.dataSource.data = this.Requerimientos.filter((requerimiento: RequerimientosModel) => requerimiento.activo == habilitados)

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.Segmentos.filter((option: any) => option.segmento.toLowerCase().includes(filterValue));
  }






}
