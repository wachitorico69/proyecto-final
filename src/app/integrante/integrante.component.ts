import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-integrante',
  imports: [],
  templateUrl: './integrante.component.html',
  styleUrl: './integrante.component.css'
})
export class IntegranteComponent {
  @Input() nombre: string = '';
  @Input() descripcion: string='';
  @Input() foto: string='';
  @Output() seleccionada = new EventEmitter<{ nombre:string, descripcion:string, foto:string}>();

  seleccionar() {
    this.seleccionada.emit({ nombre: this.nombre, descripcion: this.descripcion, foto: this.foto });
  }
}
