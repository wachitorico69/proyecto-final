import { Injectable } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { collection, Firestore } from 'firebase/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosGService {

  constructor(private firestore: Firestore) { }
  getClassCounts() {
    const clasesRef = collection(this.firestore, 'clases');
    return collectionData(clasesRef, { idField: 'id' }).pipe(
      map((clases: any[]) => {
        const conteo: Record<string, number> = {};
        clases.forEach(c => {
          const clase = c.clase || 'Sin clase';
          conteo[clase] = (conteo[clase] || 0) + 1;
        });
        return conteo;
      })
    );
  }
}
