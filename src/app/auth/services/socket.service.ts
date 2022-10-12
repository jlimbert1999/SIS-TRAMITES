import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client'
import { environment } from 'src/environments/environment';
const url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket = io.io(url)
  constructor() { }

  Escuchar(eventName: string) {
    return new Observable((observable) => {
      this.socket.on(eventName, (data: any) => {
        observable.next(data)
      })
    })
    // this.socket.on(eventName, (resp)=>{
    //   console.log(resp);
    // })
  }
  Emitir(eventName: string, data: any) {
    return new Observable((observable) => {
      this.socket.emit(eventName, data, (data: any) => {
        observable.next(data)
      })
    })
    // this.socket.emit(eventName, datos)
  }
}
