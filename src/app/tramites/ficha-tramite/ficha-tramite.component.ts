import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { InternoModel, RepresentanteModel, SolicitanteModel } from '../models/solicitante.model';
import { RegistroTramitesService } from '../services/registro-tramites.service';
import { WorkflowService } from '../services/workflow.service';
import { Layout } from '@swimlane/ngx-graph';

import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ObservacionModel, ObservacionModel_View, TramiteFichaModel } from '../models/tramite.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ParticipantesWorkflowModel } from '../models/worflow.model';

import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ficha-tramite',
  templateUrl: './ficha-tramite.component.html',
  styleUrls: ['./ficha-tramite.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaTramiteComponent implements OnInit {
  dataSource = new MatTableDataSource();
  dataSourceObservacion = new MatTableDataSource();
  Tramite: TramiteFichaModel
  Solicitante: SolicitanteModel
  Representante: RepresentanteModel
  Interno: InternoModel
  Observaciones: ObservacionModel_View[] = []
  Requerimientos_presentados: any[] = []

  Mi_observacion: any
  Otras_observaciones: ObservacionModel_View[] = []
  Instituciones: string[] = [] //para ver insit
  id_tramite: number

  @ViewChild(MatAccordion) accordion: MatAccordion;
  listaWorkflow: any[] = []



  // Variables para grafica
  nodos: any[] = []
  links: any[] = []
  clusters: { id: string, label: string, childNodeIds: string[] }[] = []

  columnsToDisplayWithExpand = ['completado', 'Emisor', 'Enviado', 'Receptor', 'Recibido', 'expand'];
  expandedElement: any
  Duracion: any
  permitir_observaciones: boolean = true

  constructor(
    private loginService: LoginService,
    private registroTramiteService: RegistroTramitesService,
    private activateRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.id_tramite = params['id']
        this.registroTramiteService.getInfoFicha(this.id_tramite).subscribe(data => {
          this.Tramite = data.tramite
          this.Requerimientos_presentados = data.requerimientos
          if (this.Tramite.fecha_finalizacion) {
            this.Duracion = this.crear_duracion(moment(new Date(this.Tramite.fecha_creacion)), moment(new Date(this.Tramite.fecha_finalizacion)))
          }
          this.getWorkflow()
          this.getSolicitud()
          this.obtener_Observaciones()

        }
        )
      }
    })
  }
  getSolicitud() {
    this.registroTramiteService.getSolictidud(this.Tramite.id_solicitante, this.Tramite.id_representante, this.Tramite.id_interno).subscribe((solicitud) => {
      this.Solicitante = solicitud.solicitante
      this.Representante = solicitud.representante
      this.Interno = solicitud.interno
    })

  }
  getWorkflow() {
    this.workflowService.getWorkflow(this.id_tramite).subscribe(resp => {
      if (resp.workflow.length != 0) {
        let fechaInicio: any, fechaFin: any
        this.listaWorkflow = resp.workflow
        resp.workflow.forEach((flujo, posFlujo: number) => {
          if (posFlujo != 0) {
            if (flujo.aceptado == false) {
              this.listaWorkflow[posFlujo]['tiempo_rechazo'] = this.crear_duracion(moment(new Date((resp.workflow[posFlujo].fecha_envio))), moment(new Date((flujo.fecha_recibido))))
            }
            //tiempo cuenta desde que lo recibe hasta que lo envie
            fechaInicio = moment(new Date((resp.workflow[posFlujo - 1].fecha_envio)))
            fechaFin = moment(new Date((flujo.fecha_envio)))
          }
          else {
            if (flujo.aceptado == false) {
              this.listaWorkflow[posFlujo]['tiempo_rechazo'] = this.crear_duracion(moment(new Date((resp.workflow[posFlujo].fecha_envio))), moment(new Date((flujo.fecha_recibido))))
            }
            //primer envio
            fechaInicio = moment(new Date((this.Tramite.fecha_creacion)))
            fechaFin = moment(new Date((flujo.fecha_envio)))
          }
          this.listaWorkflow[posFlujo]['duracion'] = this.crear_duracion(fechaInicio, fechaFin)

          resp.participantes.forEach((funcionario, posUser) => {
            if (flujo.id_cuentaEmisor == funcionario.id_cuenta) {
              resp.participantes[posUser].Funcionario = flujo.funcionario_emisor
              this.listaWorkflow[posFlujo]['CargoEmi'] = `${funcionario.NombreCar}`
              this.listaWorkflow[posFlujo]['NombreDepEmi'] = `${funcionario.NombreDep}`
              this.listaWorkflow[posFlujo]['NombreInstEmi'] = `${funcionario.sigla}`
            }
            if (flujo.id_cuentaReceptor == funcionario.id_cuenta) {
              resp.participantes[posUser].Funcionario = flujo.funcionario_receptor
              this.listaWorkflow[posFlujo]['CargoRecep'] = `${funcionario.NombreCar}`
              this.listaWorkflow[posFlujo]['NombreDepRecep'] = `${funcionario.NombreDep}`
              this.listaWorkflow[posFlujo]['NombreInstRecep'] = `${funcionario.sigla}`
            }
          })
        })
        this.dataSource.data = this.listaWorkflow
        this.crear_Nodos(resp.participantes)
        this.crear_Vinculos()
        if (this.listaWorkflow[this.listaWorkflow.length - 1].id_cuentaReceptor != this.loginService.Detalles_Cuenta.id_cuenta) {
          this.permitir_observaciones = false
        }
      }
      else {
        this.listaWorkflow = []

      }
    })
  }

  crear_Nodos(funcionarios: ParticipantesWorkflowModel[]) {
    funcionarios.forEach((funcionario, index: number) => {
      let aux = {
        id: funcionario.id_cuenta.toString(),
        label: `funcionario${funcionario.id_cuenta}`,
        data: {
          Nombre: funcionario.Funcionario,
          NombreCar: funcionario.NombreCar,
          NombreDep: funcionario.NombreDep,
          Sigla: funcionario.sigla
        },
        position: `x${index}`
      }
      this.nodos.push(aux)

      //************creacion de cluesters*************
      if (!this.Instituciones.includes(funcionario.sigla)) {
        this.Instituciones.push(funcionario.sigla)
        this.clusters.push({
          id: funcionario.sigla.toString(),
          label: `Institucion: ${funcionario.sigla.toUpperCase()}`,
          childNodeIds: []
        })
      }
    })
    this.clusters.forEach((clus, i) => {
      this.nodos.forEach((nodo: any) => {
        if (clus.id == nodo.data.Sigla) {
          this.clusters[i].childNodeIds.push(nodo.id)
        }
      })
    })
  }


  crear_Vinculos() {
    this.nodos.forEach((element: any) => {
      this.listaWorkflow.forEach((flujo: any, index: number) => {
        if (element.id == flujo.id_cuentaEmisor) {
          let aux = {
            id: `a${index}`,
            source: element.id,
            target: flujo.id_cuentaReceptor.toString(),
            label: `envio: Nro ${index + 1}`,
          }
          switch (flujo.aceptado) {
            case null:
              aux.label = 'Pendiente'
              break;
            case 0:
              aux.label = 'Rechazado'
              break;
            default:
              break;
          }
          this.links.push(aux)
        }
      })
    })
  }

  crear_duracion(inicio: any, fin: any) {

    let parts: any = [];
    let duration = moment.duration(fin.diff(inicio))
    if (duration.years() >= 1) {
      const years = Math.floor(duration.years());
      parts.push(years + " " + (years > 1 ? "años" : "año"));
    }
    if (duration.months() >= 1) {
      const months = Math.floor(duration.months());
      parts.push(months + " " + (months > 1 ? "meses" : "mes"));
    }

    if (duration.days() >= 1) {
      const days = Math.floor(duration.days());
      parts.push(days + " " + (days > 1 ? "dias" : "dia"));
    }

    if (duration.hours() >= 1) {
      const hours = Math.floor(duration.hours());
      parts.push(hours + " " + (hours > 1 ? "horas" : "hora"));
    }

    if (duration.minutes() >= 1) {
      const minutes = Math.floor(duration.minutes());
      parts.push(minutes + " " + (minutes > 1 ? "minutos" : "minuto"));
    }
    else {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    }

    // if (duration.seconds() >= 1) {
    //   const seconds = Math.floor(duration.seconds());
    //   parts.push(seconds + " " + (seconds > 1 ? "seconds" : "second"));
    // }
    return parts.join(", ")
  }

  obtener_Observaciones() {
    this.registroTramiteService.getObservaciones(this.id_tramite).subscribe(data => {
     
      const indexFound = data.findIndex(obs => obs.id_cuenta == this.loginService.Detalles_Cuenta.id_cuenta)
      if (indexFound != -1) {
        this.Mi_observacion = data[indexFound]
        console.log(this.Mi_observacion);
      }
      this.Otras_observaciones = data.filter(obs => obs.id_cuenta != this.loginService.Detalles_Cuenta.id_cuenta)
    })
   
   


  }
  corregir_Observacion() {
    Swal.fire({
      title: `Corregir observacion?`,
      text: 'La observcion sera marcada como corregida',
      showCancelButton: true,
      confirmButtonText: 'Si, corregir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#38B000',
      cancelButtonColor: '#F94144',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.registroTramiteService.putObservacion(this.Mi_observacion.id_observacion, this.id_tramite).subscribe(nuevoEstado => {
          if (nuevoEstado) {
            this.Tramite.estado = nuevoEstado
          }
          this.Mi_observacion.situacion = true
        })
      }
    })

  }



  agregar_observacion() {
    Swal.fire({
      title: `Registro observacion`,
      text: 'Ingrese la observacion',
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#38B000',
      cancelButtonColor: '#F94144',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!result.value) {
          Swal.fire({
            title: `Debe ingresar la obsevacion`,
            icon: 'error'
          })
        }
        else {
          let observacion: ObservacionModel = {
            detalle: result.value,
            id_tramite: this.id_tramite,
          }
          this.registroTramiteService.addObservacion(observacion, this.Tramite.estado).subscribe(observacion => {
            this.Mi_observacion = observacion
            if (this.Tramite.estado == 'En revision' || this.Tramite.estado == 'Inscrito') {
              this.Tramite.estado = "Observado"
            }
          })
        }
      }
    })


  }


  regresar() {
    this._location.back();
  }

}
