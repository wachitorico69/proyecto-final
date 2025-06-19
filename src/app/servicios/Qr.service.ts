import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioData {
  id: string;
  nombre: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class QrService {

  private apiUrl = 'https://proyecto-final-node-y03d.onrender.com/api/usuario'; 

  constructor(private http: HttpClient) {}

   obtenerDatosUsuario(): Observable<UsuarioData> {
    return this.http.get<UsuarioData>(this.apiUrl);
  }

  getUsuarioPorId(id: string): Observable<UsuarioData> {
    return this.http.get<UsuarioData>(`${this.apiUrl}/${id}`);
  }
}