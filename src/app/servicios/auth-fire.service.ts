import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, createUserWithEmailAndPassword  } from '@angular/fire/auth';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, doc, getDoc, setDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthFireService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore){
    this.auth.onAuthStateChanged(user => this.userSubject.next(user));
  }

  loginWithGoogle(){
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout(){
    return signOut(this.auth);
  }

  actualizarPassword(tipo: string, id: string, nuevaPassword: string): Promise<void> {
    const coleccion = tipo === 'admin' ? 'admins' : 'usuarios';
    const docRef = doc(this.firestore, `${coleccion}/${id}`);
    return updateDoc(docRef, { password: nuevaPassword,   intentos: 0, bloq: false });
  }


  async obtenerDatosUsuario(tipo: string, username: string): Promise<any> {
    const colPath = tipo === 'admin' ? 'admins' : 'usuarios';
    const colRef = collection(this.firestore, colPath);
    const q = query(colRef, where('nombre', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }

  async actualizarIntentosFallidos(tipo: string, id: string, intentos: number): Promise<void> {
    const ruta = tipo === 'admin' ? `admins/${id}` : `usuarios/${id}`;
    const docRef = doc(this.firestore, ruta);
    await updateDoc(docRef, {
      intentos: intentos
    });
  }

  async bloquearCuenta(tipo: string, id: string): Promise<void> {
    const ruta = tipo === 'admin' ? `admins/${id}` : `usuarios/${id}`;
    const docRef = doc(this.firestore, ruta);
    await updateDoc(docRef, {
      bloq: true,
      intentos: 3
    });
  }

  async enviarCorreoRecuperacion(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async registrarUsuario(nombre: string, correo: string, password: string) {
   const cred = await createUserWithEmailAndPassword(this.auth, correo, password);
    const uid = cred.user.uid;
    await setDoc(doc(this.firestore, 'usuarios', uid), {
      nombre,
      correo,
      password,
      intentos: 0,
      bloq: false
    });
  }

  async guardarDatosUsuarioGoogle(user: User): Promise<void> {
    const docRef = doc(this.firestore, 'usuarios', user.uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      await setDoc(docRef, {
        nombre: user.displayName || 'Sin nombre',
        correo: user.email || '',
        password: '', // sin contraseña
        intentos: 0,
        bloq: false
      });
    }
  }
}
