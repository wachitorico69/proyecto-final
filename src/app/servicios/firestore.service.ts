import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

export interface Inscripcion {
  clase: string;
  fecha: string;
  horario: string;
  nombre: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  guardarUsuario(usuario: { nombre: string; correo: string, password?: string }) {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return addDoc(usuariosRef, usuario);
  }

  guardarClase(clase: { nombre: string; telefono: string, clase: string, horario: string, fecha: string }) {
    const clasesRef = collection(this.firestore, 'clases');
    return addDoc(clasesRef, clase);
  }

  guardarPerfil(perfil: { nombre: string; email: string, edad: string, sexo: string, peso: string, altura: string }) {
    const perfilesRef = collection(this.firestore, 'perfiles');
    return addDoc(perfilesRef, perfil);
  }
  
  getClases(): Observable<any[]> {
    const ref = collection(this.firestore, 'clases');
    return collectionData(ref, { idField: 'id' });
  }

  getConteoPorClase(): Observable<{ clase: string, total: number }[]> {
    const ref = collection(this.firestore, 'clases');
    return collectionData(ref).pipe(
      map((inscripciones: any[]) => {
        const conteo: { [clase: string]: number } = {};
        inscripciones.forEach(i => {
          const clase = i.clase || 'Sin clase';
          conteo[clase] = (conteo[clase] || 0) + 1;
        });
        return Object.keys(conteo).map(clase => ({
          clase,
          total: conteo[clase]
        }));
      })
    );
  }

  getPerfiles(): Observable<any[]> {
    const ref = collection(this.firestore, 'perfiles');
    return collectionData(ref, { idField: 'id' });
  }

  deleteClase(id: string) {
    const docRef = doc(this.firestore, `clases/${id}`);
    return deleteDoc(docRef);
  }

  deletePerfil(id: string) {
    const docRef = doc(this.firestore, `perfiles/${id}`);
    return deleteDoc(docRef);
  }

  updateClase(id: string, data: any) {
    const docRef = doc(this.firestore, `clases/${id}`);
    return updateDoc(docRef, data);
  }

  updatePerfil(id: string, data: any) {
    const docRef = doc(this.firestore, `perfiles/${id}`);
    return updateDoc(docRef, data);
  }
}