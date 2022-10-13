import jsPDF from 'jspdf';
import * as moment from 'moment';

const generar_hoja_ruta = (data: any, fecha: string) => {
  let img = new Image()
  img.src = "../../../assets/img/sacaba/cabecera.jpg"
  const doc = new jsPDF();
  doc.addImage(img, 'png', 10, 2, 60, 25)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("HOJA DE RUTA DE CORRESPONDENCIA", 105, 20, {
    maxWidth: 70,
    align: 'center'
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Impreso: ${moment(new Date(fecha)).format('DD-MM-YYYY HH:mm:ss')}`, 200, 20, undefined, "right");
  doc.line(200, 30, 10, 30);
  doc.setFontSize(7);
  doc.text("CORRESPONDENCIA", 30, 40, undefined, "center");
  doc.text("INTERNA", 30, 43, undefined, "center");
  doc.rect(47, 38, 5, 5);
  doc.rect(67, 38, 5, 5);
  doc.rect(105, 38, 5, 5);
  doc.text("COPIA", 55, 40);
  doc.text("CORRESPONDENCIA", 90, 40, undefined, "center");
  doc.text("EXTERNA", 90, 43, undefined, "center");
  doc.rect(105, 38, 5, 5, "F"); //MARCAR COMO EXTERNO

  doc.text("NRO. UNICO DE ", 130, 40, undefined, "center");
  doc.text("CORRESPONDENCIA", 130, 43, undefined, "center");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${data.alterno}`, 150, 42);
  doc.rect(145, 36, 50, 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text("EMISION / RECEPCION: ", 45, 53);
  doc.rect(78, 50, 16, 5);
  doc.rect(98, 50, 16, 5);
  doc.rect(118, 50, 16, 5);
  doc.text(`${moment(data.fecha_creacion).format('DD-MM-YYYY')}`, 80, 53);
  doc.text(`${moment(data.fecha_creacion).format('HH:mm a')}`, 100, 53);
  doc.text(`${data.cantidad}`, 125, 53);

  doc.text(`Fecha`, 80, 48);
  doc.text(`Hora`, 100, 48);
  doc.text(`Cantidad`, 120, 48);
  doc.setFontSize(7);

  doc.rect(15, 57, 180, 85);
  doc.text("DATOS DE ORIGEN", 20, 60);
  doc.text(`CITE: ${data.cite == "" ? 'SIN CITE' : data.cite}`.toUpperCase(), 20, 65);
  doc.line(27, 66, 95, 66); // ( punto ini, pos izq, punto fin, pos der)


  doc.text("NRO DE REGISTRO INTERNO (Correlativo)", 100, 65);
  doc.rect(160, 61, 20, 6);

  doc.text(`REMITENTE: ${data.solicitante}`.toUpperCase(), 20, 75);
  doc.line(35, 76, 90, 76);
  doc.text(`CARGO: P. ${data.tipo_solicitante}`, 100, 75);
  doc.line(110, 76, 170, 76);

  doc.text(`DESTINATARIO: ${data.funcionario_receptor} `, 20, 80);
  doc.line(37, 81, 92, 81);
  doc.text(`CARGO: ${data.cargo_receptor}`, 100, 80);
  doc.line(110, 81, 170, 81);

  doc.text(`REFERENCIA: ${data.titulo} `, 20, 85);
  doc.line(35, 86, 170, 86);

  doc.text("SALIDA: ", 60, 95);
  doc.rect(78, 92, 16, 5);
  doc.rect(98, 92, 16, 5);
  doc.rect(118, 92, 16, 5);
  doc.text(`Fecha`, 80, 90);
  doc.text(`Hora`, 100, 90);
  doc.text(`Cantidad`, 120, 90);

  doc.text(`${moment(data.fecha_envio).format('DD-MM-YYYY')}`, 80, 95);
  doc.text(`${moment(data.fecha_envio).format('HH:mm a')}`, 100, 95);
  doc.text(`${data.cantidad}`, 125, 95);

  doc.text(`Destinatario 1: ${data.funcionario_receptor} (${data.cargo_receptor})`, 20, 102);
  doc.line(35, 103, 115, 103);
  doc.rect(20, 105, 30, 30);
  doc.text("INSTRUCCION / PROVEIDO:", 55, 110);
  doc.text(`${data.detalle}`, 55, 115);
  doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, 110);
  doc.rect(160, 105, 20, 6);

  doc.line(180, 127, 140, 127); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
  doc.text("Firma y sello", 150, 130);

  doc.text(`Fecha`, 52, 135);
  doc.text(`Hora`, 67, 135);
  doc.text(`Cantidad`, 83, 135);

  doc.text(`Fecha`, 139, 135);
  doc.text(`Hora`, 155, 135);
  doc.text(`Cantidad`, 172, 135);


  doc.text(`INGRESO:`, 30, 140);
  doc.rect(45, 136, 16, 5);
  doc.rect(63, 136, 16, 5);
  doc.rect(81, 136, 16, 5);

  doc.text(`SALIDA:`, 120, 140);
  doc.rect(135, 136, 16, 5);
  doc.rect(153, 136, 16, 5);
  doc.rect(171, 136, 16, 5);

  let pos_Y = 150

  for (let i = 1; i < 3; i++) {
    doc.rect(15, pos_Y - 4, 180, 50);
    doc.text(`Destinatario ${i + 1}:`, 20, pos_Y);
    doc.line(35, pos_Y + 1, 120, pos_Y + 1);
    doc.rect(20, pos_Y + 2, 30, 30);
    doc.text("INSTRUCCION / PROVEIDO ", 55, pos_Y + 10);
    doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, pos_Y + 10);
    doc.rect(160, pos_Y + 6, 20, 6);

    doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    doc.text("Firma y sello", 150, pos_Y + 30);


    doc.text(`Fecha`, 52, pos_Y + 39);
    doc.text(`Hora`, 67, pos_Y + 39);
    doc.text(`Cantidad`, 83, pos_Y + 39);

    doc.text(`Fecha`, 139, pos_Y + 39);
    doc.text(`Hora`, 155, pos_Y + 39);
    doc.text(`Cantidad`, 172, pos_Y + 39);

    doc.text(`INGRESO:`, 30, pos_Y + 43);
    doc.rect(45, pos_Y + 40, 16, 5);
    doc.rect(63, pos_Y + 40, 16, 5);
    doc.rect(81, pos_Y + 40, 16, 5);

    doc.text(`SALIDA:`, 120, pos_Y + 43);
    doc.rect(135, pos_Y + 40, 16, 5);
    doc.rect(153, pos_Y + 40, 16, 5);
    doc.rect(171, pos_Y + 40, 16, 5);
    pos_Y = pos_Y + 55


  }
  doc.text(`Nota: Esta hoja de ruta unica de correspondencia, no debera ser separada ni extraviada del documento al cual se encuentra adherida`, 20, 270);
  doc.addPage();

  pos_Y = 20
  for (let i = 3; i < 8; i++) {
    doc.rect(15, pos_Y - 4, 180, 50);
    doc.text(`Destinatario ${i + 1}:`, 20, pos_Y);
    doc.line(35, pos_Y + 1, 120, pos_Y + 1);
    doc.rect(20, pos_Y + 2, 30, 30);
    doc.text("INSTRUCCION / PROVEIDO ", 55, pos_Y + 10);
    doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, pos_Y + 10);
    doc.rect(160, pos_Y + 6, 20, 6);

    doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    doc.text("Firma y sello", 150, pos_Y + 30);


    doc.text(`Fecha`, 52, pos_Y + 39);
    doc.text(`Hora`, 67, pos_Y + 39);
    doc.text(`Cantidad`, 83, pos_Y + 39);

    doc.text(`Fecha`, 139, pos_Y + 39);
    doc.text(`Hora`, 155, pos_Y + 39);
    doc.text(`Cantidad`, 172, pos_Y + 39);

    doc.text(`INGRESO:`, 30, pos_Y + 43);
    doc.rect(45, pos_Y + 40, 16, 5);
    doc.rect(63, pos_Y + 40, 16, 5);
    doc.rect(81, pos_Y + 40, 16, 5);

    doc.text(`SALIDA:`, 120, pos_Y + 43);
    doc.rect(135, pos_Y + 40, 16, 5);
    doc.rect(153, pos_Y + 40, 16, 5);
    doc.rect(171, pos_Y + 40, 16, 5);
    pos_Y = pos_Y + 55
  }
  doc.output('dataurlnewwindow')
}

const generar_ficha_tramite = (data: any) => {
  const doc = new jsPDF('p', 'mm', [60, 90]);
  let img = new Image()
  img.src = '../../assets/img/logo_alcaldia.png'
  doc.addImage(img, 'png', 20, 0, 20, 20)
  doc.setFontSize(8)
  doc.text("Gobierno Autonomo Municipal de Sacaba", 30, 25, undefined, "center");
  doc.setFontSize(6);
  doc.text(`Tipo de tramite: ${data.titulo}`, 30, 30, {
    maxWidth: 40,
    align: 'center'
  })
  doc.text(`Fecha registro: ${moment(data.fecha_creacion).format('DD-MM-YYYY HH:mm:ss')}`, 30, 40, undefined, 'center')
  doc.text(`Numero de tramite: ${data.alterno}`, 30, 45, undefined, 'center')
  doc.text(`Pin: ${data.pin}`, 30, 50, undefined, 'center')
  if (data.tipo_solicitante == "NATURAL") {
    doc.setFontSize(5);
    doc.text(`Solicitante: DNI ${data.dni} ${data.expedido} - ${data.solicitante}`, 30, 55, undefined, 'center')
    doc.setFontSize(6);
  }
  else {
    doc.text(`Solicitante: ${data.solicitante}`.toUpperCase(), 30, 60, undefined, 'center');
  }
  doc.setFont("times", 'italic');
  doc.text(`Para la cosulta ingrese a:`, 30, 70, undefined, 'center')
  doc.text(`https://siste-sacaba.herokuapp.com/Consulta `, 30, 75, undefined, 'center')
  doc.setFont("times", 'normal');
  doc.text(`Firma ..................`, 30, 85, undefined, 'center')
  doc.autoPrint()
  doc.output('dataurlnewwindow')
}


const generar_hoja_ruta_interno = (data: any, fecha_generacion: string) => {
  console.log(data);
  // hoja de ruta generar la salida con fecha actual
  let img = new Image()
  img.src = "../../../assets/img/sacaba/cabecera.jpg"
  const doc = new jsPDF();
  doc.addImage(img, 'png', 10, 2, 60, 25)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("HOJA DE RUTA DE CORRESPONDENCIA", 105, 20, {
    maxWidth: 70,
    align: 'center'
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Impreso: ${moment(new Date(fecha_generacion)).format('DD-MM-YYYY HH:mm:ss')}`, 200, 20, undefined, "right");
  doc.line(200, 30, 10, 30);
  doc.setFontSize(7);
  doc.text("CORRESPONDENCIA", 30, 40, undefined, "center");
  doc.text("INTERNA", 30, 43, undefined, "center");
  doc.rect(47, 38, 5, 5);
  doc.rect(67, 38, 5, 5);
  doc.rect(105, 38, 5, 5);
  doc.text("COPIA", 55, 40);
  doc.text("CORRESPONDENCIA", 90, 40, undefined, "center");
  doc.text("EXTERNA", 90, 43, undefined, "center");
  doc.rect(47, 38, 5, 5, "F");  //MARCAR COMO INTERNO

  doc.text("NRO. UNICO DE ", 130, 40, undefined, "center");
  doc.text("CORRESPONDENCIA", 130, 43, undefined, "center");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${data.alterno}`, 150, 42);
  doc.rect(145, 36, 50, 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  doc.text("EMISION / RECEPCION: ", 45, 53);
  doc.rect(78, 50, 16, 5);
  doc.rect(98, 50, 16, 5);
  doc.rect(118, 50, 16, 5);
  doc.text(`${moment(data.fecha_creacion).format('DD-MM-YYYY')}`, 80, 53);
  doc.text(`${moment(data.fecha_creacion).format('HH:mm a')}`, 100, 53);
  doc.text(`${data.cantidad}`, 125, 53);

  doc.text(`Fecha`, 80, 48);
  doc.text(`Hora`, 100, 48);
  doc.text(`Cantidad`, 120, 48);
  doc.setFontSize(7);

  doc.rect(15, 57, 180, 85);
  doc.text("DATOS DE ORIGEN", 20, 60);
  doc.text(`CITE: ${data.cite == "" ? 'SIN CITE' : data.cite}`.toUpperCase(), 20, 65);
  doc.line(27, 66, 95, 66); // ( punto ini, pos izq, punto fin, pos der)
  doc.text(`${data.numero_correlativo}`, 168, 65);


  doc.text("NRO DE REGISTRO INTERNO (Correlativo)", 100, 65);
  doc.rect(160, 61, 20, 6);

  doc.text(`REMITENTE: ${data.remitente}`, 20, 75);
  doc.line(35, 76, 90, 76);
  doc.text(`CARGO: P. ${data.cargo_remitente}`, 100, 75);
  doc.line(110, 76, 170, 76);

  doc.text(`DESTINATARIO: ${data.destinatario} `, 20, 80);
  doc.line(37, 81, 92, 81);
  doc.text(`CARGO: ${data.cargo_destinatario}`, 100, 80);
  doc.line(110, 81, 170, 81);

  doc.text(`REFERENCIA: ${data.titulo} `, 20, 85);
  doc.line(35, 86, 170, 86);

  doc.text("SALIDA: ", 60, 95);
  doc.rect(78, 92, 16, 5);
  doc.rect(98, 92, 16, 5);
  doc.rect(118, 92, 16, 5);
  doc.text(`Fecha`, 80, 90);
  doc.text(`Hora`, 100, 90);
  doc.text(`Cantidad`, 120, 90);

  doc.text(`${moment(data.fecha_generacion).format('DD-MM-YYYY')}`, 80, 95);
  doc.text(`${moment(data.fecha_generacion).format('HH:mm a')}`, 100, 95);
  doc.text(`${data.cantidad}`, 125, 95);

  doc.text(`Destinatario 1: ${data.destinatario} (${data.cargo_destinatario})`, 20, 102);
  doc.line(35, 103, 115, 103);
  doc.rect(20, 105, 30, 30);
  doc.text("INSTRUCCION / PROVEIDO:", 55, 110);
  doc.text(``, 55, 115);
  doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, 110);
  doc.rect(160, 105, 20, 6);
  doc.text(`${data.detalle == null ? '' : data.detalle}`, 55, 115);

  doc.line(180, 127, 140, 127); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
  doc.text("Firma y sello", 150, 130);

  doc.text(`Fecha`, 52, 135);
  doc.text(`Hora`, 67, 135);
  doc.text(`Cantidad`, 83, 135);

  doc.text(`Fecha`, 139, 135);
  doc.text(`Hora`, 155, 135);
  doc.text(`Cantidad`, 172, 135);


  doc.text(`INGRESO:`, 30, 140);
  doc.rect(45, 136, 16, 5);
  doc.rect(63, 136, 16, 5);
  doc.rect(81, 136, 16, 5);

  doc.text(`SALIDA:`, 120, 140);
  doc.rect(135, 136, 16, 5);
  doc.rect(153, 136, 16, 5);
  doc.rect(171, 136, 16, 5);

  let pos_Y = 150

  for (let i = 1; i < 3; i++) {
    doc.rect(15, pos_Y - 4, 180, 50);
    doc.text(`Destinatario ${i + 1}:`, 20, pos_Y);
    doc.line(35, pos_Y + 1, 120, pos_Y + 1);
    doc.rect(20, pos_Y + 2, 30, 30);
    doc.text("INSTRUCCION / PROVEIDO ", 55, pos_Y + 10);
    doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, pos_Y + 10);
    doc.rect(160, pos_Y + 6, 20, 6);

    doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    doc.text("Firma y sello", 150, pos_Y + 30);


    doc.text(`Fecha`, 52, pos_Y + 39);
    doc.text(`Hora`, 67, pos_Y + 39);
    doc.text(`Cantidad`, 83, pos_Y + 39);

    doc.text(`Fecha`, 139, pos_Y + 39);
    doc.text(`Hora`, 155, pos_Y + 39);
    doc.text(`Cantidad`, 172, pos_Y + 39);

    doc.text(`INGRESO:`, 30, pos_Y + 43);
    doc.rect(45, pos_Y + 40, 16, 5);
    doc.rect(63, pos_Y + 40, 16, 5);
    doc.rect(81, pos_Y + 40, 16, 5);

    doc.text(`SALIDA:`, 120, pos_Y + 43);
    doc.rect(135, pos_Y + 40, 16, 5);
    doc.rect(153, pos_Y + 40, 16, 5);
    doc.rect(171, pos_Y + 40, 16, 5);
    pos_Y = pos_Y + 55


  }
  doc.text(`Nota: Esta hoja de ruta unica de correspondencia, no debera ser separada ni extraviada del documento al cual se encuentra adherida`, 20, 270);
  doc.addPage();

  pos_Y = 20
  for (let i = 3; i < 8; i++) {
    doc.rect(15, pos_Y - 4, 180, 50);
    doc.text(`Destinatario ${i + 1}:`, 20, pos_Y);
    doc.line(35, pos_Y + 1, 120, pos_Y + 1);
    doc.rect(20, pos_Y + 2, 30, 30);
    doc.text("INSTRUCCION / PROVEIDO ", 55, pos_Y + 10);
    doc.text("NRO. DE REGISTRO INTERNO (Correlativo)", 100, pos_Y + 10);
    doc.rect(160, pos_Y + 6, 20, 6);

    doc.line(180, pos_Y + 26, 140, pos_Y + 26); // horizontal line (largo, altura lado izq, posicion horizontal, altura lado der)
    doc.text("Firma y sello", 150, pos_Y + 30);


    doc.text(`Fecha`, 52, pos_Y + 39);
    doc.text(`Hora`, 67, pos_Y + 39);
    doc.text(`Cantidad`, 83, pos_Y + 39);

    doc.text(`Fecha`, 139, pos_Y + 39);
    doc.text(`Hora`, 155, pos_Y + 39);
    doc.text(`Cantidad`, 172, pos_Y + 39);

    doc.text(`INGRESO:`, 30, pos_Y + 43);
    doc.rect(45, pos_Y + 40, 16, 5);
    doc.rect(63, pos_Y + 40, 16, 5);
    doc.rect(81, pos_Y + 40, 16, 5);

    doc.text(`SALIDA:`, 120, pos_Y + 43);
    doc.rect(135, pos_Y + 40, 16, 5);
    doc.rect(153, pos_Y + 40, 16, 5);
    doc.rect(171, pos_Y + 40, 16, 5);
    pos_Y = pos_Y + 55
  }
  doc.output('dataurlnewwindow')
}

export {
  generar_ficha_tramite,
  generar_hoja_ruta,
  generar_hoja_ruta_interno
}


