import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { LoginService } from 'src/app/auth/services/login.service';
import { InternoModel } from '../../models/solicitante.model';
import { TramiteInternoModel_View, Tramite_Model } from '../../models/tramite.model';
import { RegistroTramitesService } from '../../services/registro-tramites.service';
import Swal from 'sweetalert2';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-dialog-registro-interno',
  templateUrl: './dialog-registro-interno.component.html',
  styleUrls: ['./dialog-registro-interno.component.css']
})
export class DialogRegistroInternoComponent implements OnInit {
  lista_tramites_internos:
    {
      id_TipoTramite: number,
      segmento: string,
      sigla: string,
      titulo: string
    }[] = []
  lista_Requerimientos: any[] = []

  TramiteInternoFormGroup: FormGroup = this._formBuilder.group({
    cantidad: ['', [Validators.required, Validators.min(0)]],
    detalle: ['', Validators.required],
    id_TipoTramite: ['', Validators.required],
    cite: ['']
  });
  InternoFormGroup: FormGroup = this._formBuilder.group({
    numero_correlativo: [''],
    remitente: ['', Validators.required],
    cargo_remitente: ['', Validators.required],
    destinatario: ['', Validators.required],
    cargo_destinatario: ['', Validators.required]
  });
  tituloDialog = "";
  spiner_carga: boolean = false


  @ViewChild('listaRequerimientos') private allSelected: MatSelectionList;
  Detalles_tramite = { //variable para guardar titulo y codigo alterno
    titulo: '',
    codigo_alterno: ''
  }

  constructor(
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TramiteInternoModel_View,
    private registroTramiteService: RegistroTramitesService,
    private loginService: LoginService,
    public dialogRef: MatDialogRef<DialogRegistroInternoComponent>,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.tituloDialog = 'Edicion'
      this.TramiteInternoFormGroup.patchValue(this.data)
      this.registroTramiteService.getInterno(this.data.id_interno).subscribe((resp: any) => {
        if (resp.ok) {
          this.InternoFormGroup.patchValue(resp.interno)
        }
      })
    }
    else {
      this.tituloDialog = 'Registro'
      this.InternoFormGroup.controls['remitente'].setValue(this.loginService.Detalles_Cuenta.funcionario)
      this.InternoFormGroup.controls['cargo_remitente'].setValue(this.loginService.Detalles_Cuenta.cargo)
      this.registroTramiteService.getTipos_Tramites(false).subscribe(tipos => {
        this.lista_tramites_internos = tipos
      })
    }
  }

  seleccionar_TipoTramite(tipo: { id_TipoTramite: number, segmento: string, sigla: string, titulo: string }) {
    this.Detalles_tramite.titulo = tipo.titulo
    this.Detalles_tramite.codigo_alterno = tipo.sigla
  }

  guardar() {
    if (this.tituloDialog == 'Registro') {
      let tramite = new Tramite_Model(
        this.TramiteInternoFormGroup.controls['id_TipoTramite'].value,
        this.TramiteInternoFormGroup.controls['detalle'].value,
        this.TramiteInternoFormGroup.controls['cantidad'].value,
        this.loginService.Detalles_Cuenta.id_cuenta,
        `${this.Detalles_tramite.codigo_alterno.toUpperCase()}-${this.loginService.Detalles_Cuenta.sigla}`,
        null,
        this.TramiteInternoFormGroup.controls['cite'].value
      )
      const solicitud = {
        tramite: tramite,
        solicitante: null,
        representante: null,
        interno: this.InternoFormGroup.value
      }
      this.registroTramiteService.addTramite(solicitud).subscribe((resp: any) => {
        if (resp.ok) {
          Swal.fire({
            title: "Registro correcto",
            text: resp.message,
            icon: 'success'
          })
          resp.Tramite['titulo'] = this.Detalles_tramite.titulo
          resp.Tramite['externo'] = false
          this.dialogRef.close(resp.Tramite)
        }
      })
    }
    else if (this.tituloDialog == 'Edicion') {
      let actualizar_tramite = null
      let actualizar_interno = null
      if (this.TramiteInternoFormGroup.dirty || this.InternoFormGroup.dirty) {
        if (this.TramiteInternoFormGroup.dirty && this.InternoFormGroup.dirty) {
          actualizar_tramite = this.TramiteInternoFormGroup.value
          actualizar_tramite['id_tramite'] = this.data.id_tramite
          actualizar_interno = this.InternoFormGroup.value
          actualizar_interno['id_interno'] = this.data.id_interno
        }
        else if (this.TramiteInternoFormGroup.dirty) {
          actualizar_tramite = this.TramiteInternoFormGroup.value
          actualizar_tramite['id_tramite'] = this.data.id_tramite
        }
        else if (this.InternoFormGroup.dirty) {
          actualizar_interno = this.InternoFormGroup.value
          actualizar_interno['id_interno'] = this.data.id_interno
        }
        this.registroTramiteService.putSolicitud(null, null, actualizar_tramite, actualizar_interno).subscribe((tramite: any) => {
          Object.assign(this.data, tramite)
          this.dialogRef.close(this.data);
        })
      }
      else {
        this.dialogRef.close()
      }
    }
  }





}
