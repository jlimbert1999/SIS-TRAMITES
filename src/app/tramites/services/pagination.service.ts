import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  items_page: number = 10
  paginator: number = 0
  termino_busqueda: string = ""
  modo_busqueda: boolean
  pageIndex: number 

  constructor() { }

  next_page() {
    this.paginator = this.paginator + this.items_page
  }

  previus_page() {
    this.paginator = this.paginator - this.items_page
  }



}
