import { Component } from '@angular/core';
import { IntegranteComponent } from '../integrante/integrante.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  imports: [IntegranteComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
 image: string = 'assets/screamer.webp';
  imagen: string = '';
  personaSeleccionada: { nombre: string, descripcion: string, foto: string } | null = null;

  onPersonaSeleccionada(persona: { nombre: string, descripcion: string, foto: string }) {
    this.personaSeleccionada = persona;
  }


  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.imagen = decodeURIComponent(params.get('image') || '');
    });
  }
}
