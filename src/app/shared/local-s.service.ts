import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalSService {
 getClases(): any[] {
    const clases = localStorage.getItem('clases');
    return clases ? JSON.parse(clases) : [];
  }

  getPerfiles(): any[] {
    const perfiles = localStorage.getItem('perfiles');
    return perfiles ? JSON.parse(perfiles) : [];
  }

  updateClases(clases: any[]): void {
    localStorage.setItem('clases', JSON.stringify(clases));
  }

  updatePerfiles(perfiles: any[]): void {
    localStorage.setItem('perfiles', JSON.stringify(perfiles));
  }
}
