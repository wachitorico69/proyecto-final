import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarraService {

  constructor() { }

  private mostrarBarraSubject = new BehaviorSubject<boolean>(false);
  mostrarBarra$ = this.mostrarBarraSubject.asObservable();

  activarBarra() {
    const actual = this.mostrarBarraSubject.getValue();
    this.mostrarBarraSubject.next(!actual);  //activar o desactivar
  }  
}
