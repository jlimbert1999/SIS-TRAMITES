import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReporteService } from '../services/reporte.service';

import Swal from 'sweetalert2';
import * as moment from 'moment'; // add this 1 of 4
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-estado',
  templateUrl: './reporte-estado.component.html',
  styleUrls: ['./reporte-estado.component.css']
})
export class ReporteEstadoComponent implements OnInit {
  reporte_listado: any[] = []
  estado: string = ""
  estados_tramite = ['Inscrito', 'Observado', 'Concluido', 'En revision']
  document: any
  pdfSrc: string
  range: any = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null)
  });
  spinner_carga: boolean = false

  tipos_tramite = [
    { value: 0, tipo: "Tramite interno" },
    { value: 1, tipo: "Tramite externo" },
  ]
  tipo_reporte: number

  constructor(private reporteService: ReporteService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  generar(tramite_estado: string, rango: any, externo: string) {
    this.reporte_listado = []
    if (!rango.start || !rango.end || !this.tipo_reporte) {
      this.openSnackBar('Seleccione el intervalo')
    }
    else {
      this.spinner_carga = true
      let desde = rango.start.getTime()
      let hasta = rango.end.getTime()
      this.reporteService.reporte_estado(tramite_estado, desde, hasta, externo).subscribe((reporte: any[]) => {
        if (reporte.length == 0) {
          // this.openSnackBar('No se econtraron registros')\
          Swal.fire({
            title: 'No se econtraron registros con el estado',
            icon: 'info'
          })
          this.spinner_carga = false
        }
        else {
         
          this.estado = tramite_estado
          if(externo=='1'){
            reporte.forEach((element: any, index: number) => {
              this.reporte_listado.push([++index, element.alterno, moment(element.fecha_creacion).format('DD-MM-YYYY HH:mm:ss'), element.titulo, `${element.nombre} ${element.apellido_m || ""} ${element.apellido_m || ""}`.toUpperCase()])
            })
          }
          else if(externo=='0'){
            reporte.forEach((element: any, index: number) => {
              this.reporte_listado.push([++index, element.alterno, moment(element.fecha_creacion).format('DD-MM-YYYY HH:mm:ss'), element.titulo, `${element.remitente}`.toUpperCase()])
            })
          }
         
          this.spinner_carga = false
          this.Crear_PDF_estados('ver')
        }
      })
    }
  }
  Crear_PDF_estados(opcion: string) {
    console.log(this.tipo_reporte);
    let time = new Date()
    let fecha = moment(time).format('DD-MM-YYYY HH:mm:ss');
    let img = new Image()
    img.src = '../../../assets/img/logo_alcaldia.png'
    //horizonal, vertical
    const doc = new jsPDF();

    //CREACION
    doc.addImage(img, 'png', 5, 0, 30, 30)
    doc.setFont("helvetica", "bold");
    doc.text("Reporte estado tramite", 105, 20, undefined, "center");
    doc.text(`"${this.estado}"`, 105, 27, undefined, "center");
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(`Impreso: ${fecha}`, 200, 20, undefined, "right");
    doc.line(200, 30, 10, 30); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    let cabeceras = ['Nro.', 'Codigo', 'Creacion', 'Titulo', 'Solicitante']
    if (this.tipo_reporte == 0) {
      cabeceras = ['Nro.', 'Codigo', 'Creacion', 'Titulo', 'Remitente']
    }
    autoTable(doc, {
      startY: 40,
      head: [cabeceras],
      body: this.reporte_listado,
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
        doc.save(`Reporte_estado (${this.estado}).pdf`)
        break;
      }
    }
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, undefined, {
      duration: 3000
    });
  }
  generar_tipo(tipo: string) {
    if (this.reporte_listado.length == 0) {
      this.openSnackBar('Primero debe generar el reporte')
    }
    else {
      this.Crear_PDF_estados(tipo)
    }

  }

}
