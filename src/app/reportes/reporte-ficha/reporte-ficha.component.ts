import { Component, OnInit } from '@angular/core';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { ReporteService } from '../services/reporte.service';
import Swal from 'sweetalert2';

import * as moment from 'moment'; // add this 1 of 4
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepresentanteModel, SolicitanteModel } from 'src/app/tramites/models/solicitante.model';
@Component({
  selector: 'app-reporte-ficha',
  templateUrl: './reporte-ficha.component.html',
  styleUrls: ['./reporte-ficha.component.css']
})
export class ReporteFichaComponent implements OnInit {

  spiner_carga: boolean = false;
  data_ReporteFicha = {
    Solicitante: <SolicitanteModel>{},
    Tramite: <any>{},
    Representante: <RepresentanteModel>{},
    Interno: <any>{},
    Requerimientos_presentados: <any>{},
    Cronologia: [],
    titulo: ''
  }
  pdfSrc: string

  constructor(private reporteService: ReporteService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  obtener_reporte_ficha(alterno: string) {

    alterno = alterno.trim()
    if (alterno) {
      this.spiner_carga = true
      this.reporteService.reporte_ficha(alterno).subscribe((resp: { tramite: any, solicitud: any, workflow: any }) => {
        if (resp.tramite) {
          console.log(resp);
          this.data_ReporteFicha.Tramite = resp.tramite.tramite
          this.data_ReporteFicha.titulo = resp.tramite.tramite.titulo
          this.data_ReporteFicha.Requerimientos_presentados = resp.tramite.requerimientos
          this.data_ReporteFicha.Solicitante = resp.solicitud.solicitante
          console.log(resp.solicitud.solicitante);
          this.data_ReporteFicha.Representante = resp.solicitud.representante
          this.data_ReporteFicha.Interno = resp.solicitud.interno
          this.data_ReporteFicha.Cronologia = resp.workflow
          this.spiner_carga = false
          this.crear_PDF('ver')
        }
        else {
          this.spiner_carga = false
          Swal.fire({
            title: `No se econtraron resultados con el alterno: (${alterno})`,
            icon: 'info'
          })
        }
      })
    }
    else {
      this.openSnackBar('Ingrese el alterno')
    }



  }
  crear_PDF(tipo: string) {
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../../assets/img/logo_alcaldia.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION
    doc.addImage(img, 'png', 5, 0, 30, 30)
    doc.setFont("helvetica", "bold");
    doc.text("Ficha de tramite", 105, 20, undefined, "center");
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12)
    doc.text("Datos del tramite", 20, 40);
    doc.setFontSize(10)
    doc.setFont('helvetica', "normal");
    doc.text(`Tipo: ${this.data_ReporteFicha.titulo}`, 20, 50, {
      maxWidth: 80
    });
    doc.text(`Tramite: ${this.data_ReporteFicha.Tramite.alterno}`, 20, 60);
    doc.text(`Detalle: ${this.data_ReporteFicha.Tramite.detalle}`, 20, 65);
    doc.text(`Registrado: ${moment(parseInt(this.data_ReporteFicha.Tramite.fecha_creacion)).format('DD-MM-YYYY HH:mm:ss')}`, 20, 70);
    doc.text(`Hojas: ${this.data_ReporteFicha.Tramite.cantidad}`, 20, 75);
    let segmento = this.data_ReporteFicha.Tramite.alterno.split('-')
    let lista_cronologica: any[] = []
    let posY = 0
    if (this.data_ReporteFicha.Interno) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12)
      doc.text("Datos remitente", 100, 40);
      doc.text("Datos destinatario", 20, 85);
      doc.setFontSize(10)
      doc.setFont('helvetica', "normal");
      doc.text(`Nombre: ${this.data_ReporteFicha.Interno.remitente}`.toLocaleUpperCase(), 100, 50);
      doc.text(`Cargo: ${this.data_ReporteFicha.Interno.cargo_remitente}`.toLocaleUpperCase(), 100, 55);

      doc.text(`Nombre: ${this.data_ReporteFicha.Interno.destinatario}`.toLocaleUpperCase(), 20, 95);
      doc.text(`Cargo: ${this.data_ReporteFicha.Interno.cargo_destinatario}`.toUpperCase(), 20, 100);
      posY = 100
    }
    else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12)
      doc.text("Datos solicitante", 120, 40);
      doc.setFontSize(10)
      doc.setFont('helvetica', "normal");
      if (this.data_ReporteFicha.Solicitante.tipo_solicitante == "JURIDICO") {
        doc.text(`Nombre: ${this.data_ReporteFicha.Solicitante.nombre}`.toLocaleUpperCase(), 120, 50);
        doc.text(`Telefono: ${this.data_ReporteFicha.Solicitante.telefono}`, 120, 55);
      }
      else if (this.data_ReporteFicha.Solicitante.tipo_solicitante == "NATURAL") {
        doc.text(`Nombre: ${this.data_ReporteFicha.Solicitante.nombre} ${this.data_ReporteFicha.Solicitante.apellido_p} ${this.data_ReporteFicha.Solicitante.apellido_m}`.toLocaleUpperCase(), 120, 50);
        doc.text(`Dni: ${this.data_ReporteFicha.Solicitante.dni}  ${this.data_ReporteFicha.Solicitante.expedido}`, 120, 55);
        doc.text(`Telefono: ${this.data_ReporteFicha.Solicitante.telefono}`, 120, 60);

      }


      let alturaTable: number = 80
      if (this.data_ReporteFicha.Representante) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12)
        doc.text("Datos representante", 20, 85);
        doc.setFontSize(10)
        doc.setFont('helvetica', "normal");
        doc.text(`Nombre: ${this.data_ReporteFicha.Representante.nombre} ${this.data_ReporteFicha.Representante.apellido_p}  ${this.data_ReporteFicha.Representante.apellido_m}`.toLocaleUpperCase(), 20, 90);
        doc.text(`Dni: ${this.data_ReporteFicha.Representante.dni}  ${this.data_ReporteFicha.Representante.expedido}`, 20, 95);
        doc.text(`Telefono: ${this.data_ReporteFicha.Representante.telefono}`, 20, 100);
        alturaTable = 110
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12)
      doc.text("Requisitos presentados", 105, alturaTable, undefined, "center");

      let campos: string[][] = []

      this.data_ReporteFicha.Requerimientos_presentados.forEach((element: any, i: number) => {
        campos.push([++i, segmento[0], element.detalle])
      })
      if (campos.length == 0) {
        campos.push(['-', "-", "No se presentaron requisitos"])
      }
      autoTable(doc, {
        // startY : (doc as any).lastAutoTable.finalY,
        startY: alturaTable + 5,
        head: [['Numero', 'Tipo', 'Requisito']],
        body: campos,
        theme: 'grid',
        margin: { horizontal: 20 },
        headStyles: {
          'fillColor': [255, 255, 255],
          'textColor': [0, 0, 0]
        }
      })
      posY = (doc as any).lastAutoTable.finalY;

    }



    doc.text("Ruta del tramite", 105, posY + 10, undefined, "center");
    this.data_ReporteFicha.Cronologia.forEach((element: any) => {
      lista_cronologica.push([moment(parseInt(element.fecha_envio)).format('DD-MM-YYYY HH:mm:ss'), moment(parseInt(element.fecha_recibido)).format('DD-MM-YYYY HH:mm:ss'), `${element.institucionEmi}-${element.dependenciaEmi}`, `${element.institucionRec}-${element.dependenciaRec}`])
    });

    if (lista_cronologica.length > 0) {
      autoTable(doc, {
        startY: posY + 15,
        head: [['Emision', 'Recepcion', 'Dependencia origen', 'Dependencia Destino']],
        body: lista_cronologica,
        theme: 'grid',
        margin: { horizontal: 20 },
        headStyles: {
          'fillColor': [255, 255, 255],
          'textColor': [0, 0, 0]
        }
      })
    }
    else if (lista_cronologica.length == 0) {
      doc.text("El tramite aun no ha sido remitido", 105, posY + 20, undefined, "center");
    }

    switch (tipo) {
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
        doc.save(`Reporte_ficha (${this.data_ReporteFicha.Tramite.alterno}).pdf`)
        break;
      }

    }

    // doc.output('dataurlnewwindow')
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000
    });
  }
  generar_tipo(tipo: string) {
    if (Object.keys(this.data_ReporteFicha.Tramite).length == 0) {
      this.openSnackBar('Primero debe generar el reporte')
    }
    else {
      this.crear_PDF(tipo)
    }

  }

}
