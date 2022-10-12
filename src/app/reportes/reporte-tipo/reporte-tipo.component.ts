import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistroTramitesService } from 'src/app/tramites/services/registro-tramites.service';
import Swal from 'sweetalert2';
import { ReporteService } from '../services/reporte.service';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import { fadeInOnEnterAnimation } from 'angular-animations';
@Component({
  selector: 'app-reporte-tipo',
  templateUrl: './reporte-tipo.component.html',
  styleUrls: ['./reporte-tipo.component.css'],
  animations: [
    fadeInOnEnterAnimation()
  ]
})
export class ReporteTipoComponent implements OnInit {

  range: any = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  pdfSrc: string
  tipos_tramite: any[]
  Segmentos: string[] = []
  tramites_segmentados: any[] = []
  spiner_carga: boolean = false
  listado_reporte: any[] = []
  Tipo_Reporte: number
  cabeceras: string[]

  constructor(private regitroTramiteService: RegistroTramitesService, private snackBar: MatSnackBar, private reporteService: ReporteService) { }

  ngOnInit(): void {

  }
  obtener_tipos_tramites(tipo: boolean) {
    this.Segmentos = []
    this.regitroTramiteService.getTipos_Tramites(tipo).subscribe(tramites => {
      tramites.forEach((element: any) => {
        if (!this.Segmentos.includes(element.segmento)) {
          this.Segmentos.push(element.segmento)
        }
      });
      console.log(tramites);
      this.tipos_tramite = tramites
    })

  }
  seleccionar_segmento_tramite(tipo: string) {
    this.tramites_segmentados = []
    this.tramites_segmentados = this.tipos_tramite.filter((tipo_tramite: any) => tipo_tramite.segmento == tipo)
  }
  generar(tipo: any, rango: any) {
    this.listado_reporte=[]
    if (tipo == null || rango.start == null || rango.end == null) {
      this.snackBar.open("Seleccione todos los campos", undefined, {
        duration: 3000
      });
    }
    else {
      this.reporteService.reporte_tipo(tipo, rango.start.getTime(), rango.end.getTime(), this.Tipo_Reporte).subscribe((reporte: any[]) => {
        if (reporte.length > 0) {
          if (this.Tipo_Reporte == 1) {
            //EXTERNO
            this.cabeceras = ['Numero', 'Titulo', 'Codigo', 'Creacion', 'Solicitante', 'Estado']
            reporte.forEach((tramite: any, i: number) => {
              this.listado_reporte.push([i + 1, tramite.titulo, tramite.alterno, moment(tramite.fecha_creacion).format('DD-MM-YYYY HH:mm:ss'), `${tramite.nombre} ${tramite.apellido_p || ""} ${tramite.apellido_m || ""}`, tramite.estado])
            })
          }
          else if (this.Tipo_Reporte == 0) {
            //INTERNO
            this.cabeceras = ['Numero', 'Titulo', 'Codigo', 'Creacion', 'Remitente', 'Estado']
            reporte.forEach((tramite: any, i: number) => {
              this.listado_reporte.push([i + 1, tramite.titulo, tramite.alterno, moment(tramite.fecha_creacion).format('DD-MM-YYYY HH:mm:ss'), `${tramite.remitente}`, tramite.estado])
            })
          }

          this.Crear_PDF_estados('ver', this.cabeceras)
        }
        else {
          Swal.fire({
            title: 'No se encontraron resultados con el tipo de tramite seleccionado',
            icon: 'info'
          })
        }
      })
    }

  }

  Crear_PDF_estados(opcion: string, cabeceras: string[]) {
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../../assets/img/logo_alcaldia.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION
    doc.addImage(img, 'png', 5, 0, 30, 30)
    doc.setFont("helvetica", "bold");
    doc.text("Reporte tipo tramite", 105, 20, undefined, "center");
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)

    autoTable(doc, {
      startY: 40,
      head: [['Numero', 'Titulo', 'Codigo', 'Creacion', 'Solicitante', 'Estado']],
      body: this.listado_reporte,
      theme: 'grid',
      margin: { horizontal: 20 },
      headStyles: {
        'fillColor': [255, 255, 255],
        'textColor': [0, 0, 0]
      }
    })
    switch (opcion) {
      case 'ver': {
        //statements; 
        this.pdfSrc = doc.output('bloburl').toString()
        break;
      }
      case 'imprimir': {
        doc.autoPrint()
        doc.output('dataurlnewwindow')
        break;
      }
      case 'guardar': {
        doc.save('Reporte_tipos Tramite.pdf')
        break;
      }
    }
  }
  generar_tipo(tipo: string) {
    if (this.listado_reporte.length == 0) {
      this.openSnackBar('Primero debe generar el reporte')
    }
    else {
      this.Crear_PDF_estados(tipo, this.cabeceras)
    }
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000
    });
  }
  cambiar_tipo_tramite(tipo: number) {
    this.Tipo_Reporte = tipo
    if (tipo == 1) {
      this.obtener_tipos_tramites(true)
    }
    else if (tipo == 0) {
      this.obtener_tipos_tramites(false)
    }
  }
}
