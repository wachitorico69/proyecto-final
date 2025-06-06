import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  guardarUsuario(usuario: { nombre: string; correo: string, password: string }) {
    const usuariosRef = collection(this.firestore, 'usuarios');
    return addDoc(usuariosRef, usuario);
  }

  getClases(): Observable<any[]> {
    const ref = collection(this.firestore, 'clases');
    return collectionData(ref, { idField: 'id' });
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