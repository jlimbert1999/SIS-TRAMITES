import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { RequerimientosModel, TipoTramiteModel } from 'src/app/configuraciones/models/tipoTramite.model';
import { TiposTramitesService } from 'src/app/configuraciones/services/tipos-tramites.service';
import { RepresentanteModel, SolicitanteModel } from '../../models/solicitante.model';
import { Tramite_Model } from '../../models/tramite.model';
import { RegistroTramitesService } from '../../services/registro-tramites.service';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/auth/services/login.service';
@Component({
  selector: 'app-dialog-registro-tramite',
  templateUrl: './dialog-registro-tramite.component.html',
  styleUrls: ['./dialog-registro-tramite.component.css']
})
export class DialogRegistroTramiteComponent implements OnInit {
  lista_TiposTramites: TipoTramiteModel[] = []
  lista_tramites_segmentados: TipoTramiteModel[] = []
  lista_Requerimientos: RequerimientosModel[] = []
  elemento_tabla: any  //objeto que se envira a la tabla para agregarlo

  TiposDoc: any[] = []
  Lugares: any[] = [
    { nombre: 'Cochabamba', sigla: 'CB' },
    { nombre: 'Santa Cruz', sigla: 'SC' },
    { nombre: 'La paz', sigla: 'LP' },
    { nombre: 'Beni', sigla: 'BN' },
    { nombre: 'Pando', sigla: 'PN' },
    { nombre: 'Oruro', sigla: 'OR' },
    { nombre: 'Potosi', sigla: 'PT' },
    { nombre: 'Tarija', sigla: 'TR' },
    { nombre: 'Chuquisaca', sigla: 'CH' },
  ]

  solicitante: SolicitanteModel
  representante: RepresentanteModel
  Ids_requisitos_presentados: number[] = []
  regis_Representante: boolean = false
  tituloDialog = "";

  spiner_carga: boolean = false


  @ViewChild('listaRequerimientos') private allSelected: MatSelectionList;

  tiene_representante: boolean = false //varible para ver si tiene rep al momento de editar
  isLinear = false;

  TramiteFormGroup: FormGroup;
  SolicitanteFormGroup: FormGroup;
  RepresentanteFormGroup: FormGroup;

  Tipos_Solicitantes = [
    { tipo: 'NATURAL', nombre: 'Persona NATURAL' },
    { tipo: 'JURIDICO', nombre: 'Persona JURIDICA' }
  ]
  Tipo_Solicitante: string = ""
  Segmentos: string[] = []

  Detalle_tramite = { //variable para guardar titulo y codigo alterno
    titulo: '',
    codigo_alterno: ''
  }
  Info_cuenta_actual = this.loginService.Detalles_Cuenta

  constructor(
    private tiposTramiteService: TiposTramitesService,
    private regitroTramiteService: RegistroTramitesService,
    public dialogRef: MatDialogRef<DialogRegistroTramiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.iniciar_form_Tramite()
    this.iniciar_form_Solicitante_Natural()
    if (!this.data) {
      this.tituloDialog = "Nuevo";
      this.regitroTramiteService.getTipos_Tramites(true).subscribe(tipos => {
        tipos.forEach(element => {
          if (!this.Segmentos.includes(element.segmento)) {
            this.Segmentos.push(element.segmento)
          }
        });
        this.lista_TiposTramites = tipos
      })

    }
    else {
      this.tituloDialog = "Edicion";
      this.TramiteFormGroup = this._formBuilder.group({
        cantidad: ['', [Validators.required, Validators.min(0)]],
        detalle: ['', Validators.required],
    
        cite: ['']
      });
      this.TramiteFormGroup.patchValue(this.data)

      this.obtener_Requerimientos_Tramite(this.data.id_TipoTramite)
      
      if (this.data.id_requerimientos) {
        this.Ids_requisitos_presentados = this.data.id_requerimientos.split(',').map(Number)
      }
      this.obtener_Solicitante_Representante(this.data.id_solicitante, this.data.id_representante)
    }
  }

  seleccionar_segmento_tramite(tipo: string) {
    this.lista_Requerimientos = []
    this.lista_tramites_segmentados = this.lista_TiposTramites.filter(tipo_tramite => tipo_tramite.segmento == tipo)
  }
  seleccionar_TipoTramite(tipoTramite: TipoTramiteModel) {
    this.Detalle_tramite.codigo_alterno = tipoTramite.sigla
    this.Detalle_tramite.titulo = tipoTramite.titulo
    this.obtener_Requerimientos_Tramite(tipoTramite.id_TipoTramite!)
  }
  obtener_Requerimientos_Tramite(id_TipoTramite: number) {
    this.spiner_carga = true
    this.tiposTramiteService.getRequerimientos_Habilitados(id_TipoTramite).subscribe(data => {
      this.spiner_carga = false
      this.lista_Requerimientos = data
    })
  }

  registrar_Tramite() {
    let solicitud
    Swal.fire({
      title: 'Espere',
      text: 'Guardando informacion',
      icon: 'info',
      allowOutsideClick: false
    })
    Swal.showLoading();
    let tramite = new Tramite_Model(
      this.TramiteFormGroup.controls['id_TipoTramite'].value,
      this.TramiteFormGroup.controls['detalle'].value,
      this.TramiteFormGroup.controls['cantidad'].value,
      `${this.Detalle_tramite.codigo_alterno.toLocaleUpperCase()}-${this.Info_cuenta_actual.sigla}`,
      this.Ids_requisitos_presentados.toString(),
      this.TramiteFormGroup.controls['cite'].value
    )
    this.solicitante = this.SolicitanteFormGroup.value
    if (this.regis_Representante) {

      this.representante = this.RepresentanteFormGroup.value
      solicitud = { tramite: tramite, solicitante: this.solicitante, representante: this.representante, interno: null }
    }
    else {
      solicitud = { tramite: tramite, solicitante: this.solicitante, representante: null, interno: null }
    }

    this.regitroTramiteService.addTramite(solicitud)
      .subscribe((resp: any) => {
        if (resp.ok) {
          // console.log(object);
          if (resp.Tramite.tipo_solicitante == "NATURAL") {
            resp.Tramite['solicitante'] = `${resp.Tramite.nombre} ${resp.Tramite.apellido_p} ${resp.Tramite.apellido_m || ""}`
          }
          else if (resp.Tramite.tipo_solicitante == "JURIDICO") {
            resp.Tramite['solicitante'] = resp.Tramite.nombre
          }

          resp.Tramite['titulo'] = this.Detalle_tramite.titulo
          Swal.close()
          this.dialogRef.close(resp.Tramite)
        }

      })

  }

  editar_Tramite() {

    let solicitante, representante
    //los valores null no se actualizaran
    let operaciones = {
      tramite: null,
      solicitante: null,
      representante: null
    }
    switch (this.tiene_representante) {
      case true:

        if (this.SolicitanteFormGroup.touched && this.RepresentanteFormGroup.touched) {

          solicitante = this.SolicitanteFormGroup.value
          representante = this.RepresentanteFormGroup.value
          // para volver a tener los id detro 
          solicitante.id_solicitante = this.data.id_solicitante
          representante.id_representante = this.data.id_representante
          operaciones.solicitante = solicitante
          operaciones.representante = representante
        }
        else if (this.SolicitanteFormGroup.touched) {
          solicitante = this.SolicitanteFormGroup.value
          solicitante.id_solicitante = this.data.id_solicitante
          operaciones.solicitante = solicitante
        }
        else if (this.RepresentanteFormGroup.touched) {
          representante = this.RepresentanteFormGroup.value
          representante.id_representante = this.data.id_representante
          operaciones.representante = representante
        }
        break;

      case false:
        if (this.SolicitanteFormGroup.touched) {
          solicitante = this.SolicitanteFormGroup.value
          solicitante.id_solicitante = this.data.id_solicitante
          operaciones.solicitante = solicitante
        }
        break;

    }
    if (this.TramiteFormGroup.touched || this.data.id_requerimientos.toString() !== this.Ids_requisitos_presentados.toString()) {
      let datos_update_tramite: any = {
        id_tramite: this.data.id_tramite,
        detalle: this.TramiteFormGroup.controls['detalle'].value,
        cantidad: this.TramiteFormGroup.controls['cantidad'].value,
        cite: this.TramiteFormGroup.controls['cite'].value,
        id_requerimientos: this.Ids_requisitos_presentados.toString()
      }
      operaciones.tramite = datos_update_tramite
    }
    if (!operaciones.tramite && !operaciones.solicitante && !operaciones.representante) {
      this.dialogRef.close()
    }
    else {
      this.regitroTramiteService.putSolicitud(operaciones.solicitante, operaciones.representante, operaciones.tramite, undefined).subscribe((tramite_tabla: any) => {
        Swal.fire({
          title: "Registro correcto",
          text: "se actualizo la solicitud",
          icon: 'success'
        })
        //remplazar los valores nuevos
        Object.assign(this.data, tramite_tabla)
        if (this.data.tipo_solicitante == "NATURAL") {
          this.data['solicitante'] = `${this.data.nombre} ${this.data.apellido_p} ${this.data.apellido_m || ""}`
        }
        else if (this.data.tipo_solicitante == "JURIDICO") {
          this.data['solicitante'] = this.data.nombres
        }
        this.dialogRef.close(this.data)
      })
    }

  }
  obtener_Solicitante_Representante(id_solicitante: number, id_representante: number) {
    this.regitroTramiteService.getSolictidud(id_solicitante, id_representante, null).subscribe((resp: any) => {

      this.regitroTramiteService.getTipos_Documentos().subscribe((resp: any) => {
        if (resp.ok) {
          this.TiposDoc = resp.Tipos
        }
      })
      if (resp.solicitante.tipo_solicitante == 'NATURAL') {
        this.Tipo_Solicitante = 'NATURAL'
        this.iniciar_form_Solicitante_Natural()
        this.SolicitanteFormGroup.patchValue(resp.solicitante)

        if (id_representante) {
          this.iniciar_form_Representante()
          this.RepresentanteFormGroup.patchValue(resp.representante)

          this.tiene_representante = true
          this.regis_Representante = true //para mostrar la ventana del represetante
        }
        else {
          this.tiene_representante = false
        }
      }
      else {
        this.Tipo_Solicitante = 'JURIDICO'
        this.iniciar_form_Solicitante_Juridico()
        this.SolicitanteFormGroup.patchValue(resp.solicitante)

        if (id_representante) {
          this.iniciar_form_Representante()
          this.RepresentanteFormGroup.patchValue(resp.representante)

          this.tiene_representante = true
          this.regis_Representante = true //para mostrar la ventana del represetante
        }
        else {
          this.tiene_representante = false
        }
      }

    })
  }


  seleccionar_tipo_solicitante(tipo: string) {
    this.Tipo_Solicitante = tipo
    if (tipo == 'NATURAL') {
      this.iniciar_form_Solicitante_Natural()
      this.regitroTramiteService.getTipos_Documentos().subscribe((resp: any) => {
        if (resp.ok) {
          this.TiposDoc = resp.Tipos
        }
      })
    }
    else if (tipo == 'JURIDICO') {
      this.iniciar_form_Solicitante_Juridico()
    }
  }


  onNoClick() {
    this.dialogRef.close();
  }
  onGroupsChange(options: MatListOption[]) {
    this.Ids_requisitos_presentados = options.map(o => o.value)
  }
  selectAll() {
    this.allSelected.selectAll();
    this.Ids_requisitos_presentados = this.lista_Requerimientos.map(o => o.id_requerimiento!)
  }
  deselectAll() {
    this.allSelected.deselectAll();
    this.Ids_requisitos_presentados = []
  }
  iniciar_form_Tramite() {
    this.TramiteFormGroup = this._formBuilder.group({
      cantidad: ['', [Validators.required, Validators.min(0)]],
      detalle: ['', Validators.required],
      id_TipoTramite: ['', Validators.required],
      cite: ['']
    });

  }
  iniciar_form_Solicitante_Natural() {
    this.SolicitanteFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      apellido_p: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      apellido_m: ['', Validators.pattern('[a-zA-Z ]*')],
      id_documento: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      expedido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      tipo_solicitante: ['NATURAL']
    });
  }
  iniciar_form_Solicitante_Juridico() {
    this.SolicitanteFormGroup = this._formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      tipo_solicitante: ['JURIDICO']
    });
  }
  iniciar_form_Representante() {
    this.RepresentanteFormGroup = this._formBuilder.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      apellido_p: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      apellido_m: ['', Validators.pattern('[a-zA-Z ]*')],
      id_documento: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      expedido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }
  cargar_Inputs() {

  }

  habilitar_representante(valor: boolean) {
    if (valor) {
      this.iniciar_form_Representante()
      this.regis_Representante = true
    }
    else {
      this.regis_Representante = false
    }
  }
  Registrar_Datos() {
    if (this.tituloDialog == "Nuevo") {
      this.registrar_Tramite()
    }
    else if (this.tituloDialog == "Edicion") {
      this.editar_Tramite()
    }
  }

  getErrorMessage_Nombre() {
    if (this.SolicitanteFormGroup.controls['nombre'].hasError('pattern')) {
      return 'Solo se permiten letras';
    }
    return this.SolicitanteFormGroup.controls['nombre'].hasError('required') ? 'El campo es requerido' : '';
  }
  getErrorMessage_ApellidoPaterno() {
    if (this.SolicitanteFormGroup.controls['apellido_p'].hasError('pattern')) {
      return 'Solo se permiten letras';
    }
    return this.SolicitanteFormGroup.controls['apellido_p'].hasError('required') ? 'El campo es requerido' : '';
  }
  getErrorMessage_ApellidoMaterno() {
    return this.SolicitanteFormGroup.controls['apellido_m'].hasError('pattern') ? 'Solo se permiten letras' : '';

  }
  getErrorMessage_Documento() {
    return this.SolicitanteFormGroup.controls['id_documento'].hasError('required') ? 'Seleccione el tipo de documento' : '';
  }
  getErrorMessage_Dni() {
    if (this.SolicitanteFormGroup.controls['dni'].hasError('pattern')) {
      return 'Solo se permiten numeros';
    }
    return this.SolicitanteFormGroup.controls['dni'].hasError('required') ? 'El campo es requerido' : '';
  }
  getErrorMessage_Expedido() {
    return this.SolicitanteFormGroup.controls['expedido'].hasError('required') ? 'Seleccione el departamento' : '';
  }
  getErrorMessage_Telefono() {
    if (this.SolicitanteFormGroup.controls['telefono'].hasError('pattern')) {
      return 'Solo se permiten numeros';
    }
    return this.SolicitanteFormGroup.controls['telefono'].hasError('required') ? 'El campo es requerido' : '';
  }

}