import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcultarformsService {

  constructor() { }

  // Inicializa el booleano en false (o el valor que necesites)
  private booleanSubject = new BehaviorSubject<boolean>(false);

  // Observable que los componentes pueden suscribirse
  boolean$ = this.booleanSubject.asObservable();

  // Método para actualizar el valor
  setBoolean(value: boolean) {
    this.booleanSubject.next(value);
  }
}
