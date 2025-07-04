import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminlogService } from '../shared/adminlog.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';
import { BarraService } from '../servicios/barra.service';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, query, where, doc, updateDoc  } from 'firebase/firestore';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeComponent } from 'angularx-qrcode';
import { QrService, UsuarioData } from '../servicios/Qr.service';
import { OcultarformsService } from '../servicios/ocultarforms.service';
import { AuthFireService } from '../servicios/auth-fire.service';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-header',
  imports: [ReactiveFormsModule, RouterModule, HttpClientModule, QRCodeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  loginForm: FormGroup;
  loginError: boolean = false;
  userlog: string | null = null;
  administrador: boolean = false;
  usuario: boolean = false;
  qrData = '';
  cargando = true;
  modalVisible = false;
  logged = false;
  uidManual: string | null = null;
  abrirModalQR() {
    this.cargando = true;
    this.modalVisible = true;
    this.generarQR(); // Aquí llamamos a la función que carga los datos y genera el QR
  }

  cerrarModalQR(event: Event) {
    event.stopPropagation();
    this.modalVisible = false;
  }

  constructor(private fb: FormBuilder, private authService: AuthFireService, private adminService: AdminlogService, private router: Router, private barraService: BarraService, 
    private firestore: Firestore, private qrService: QrService, private ocultarService: OcultarformsService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  generarQR() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    let uid = null;

    if (this.uidManual) {
      uid = this.uidManual;
    } else if (currentUser) {
      uid = currentUser.uid;
    }

    if (uid) {
      this.qrService.getUsuarioPorId(uid).subscribe(data => {
        this.qrData = JSON.stringify(data);
        this.cargando = false;
      });
    } else {
      console.error('No se pudo obtener UID para generar el QR');
    }
  }


  //mostrar el boton de accesibilidad
  enNosotros = false;

  ngOnInit() {
    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute((event as NavigationEnd).urlAfterRedirects);
      });
  }

  private checkRoute(url: string) {
    this.enNosotros = url === '/nosotros/assets%252Fimg2.jpg';
  }

  //mostrar la barra
  mostrarBarra() {
    this.barraService.activarBarra();
  }

  login(): void {
    const { username, password } = this.loginForm.value;

    const usersRef = collection(this.firestore, 'usuarios');
    const q = query(usersRef, where('nombre', '==', username), where('password', '==', password));

    getDocs(q).then(snapshot => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0];
        const usuario = docData.data();

        this.uidManual = docData.id; 
        this.userlog = usuario['nombre'];
        this.loginError = false;
        this.logged = true;
        this.ocultarService.setBoolean(true);

        this.generarQR();

      } else {
        this.loginError = true;
        this.loginForm.get('username')?.setErrors({ incorrecto: true });
        this.loginForm.get('password')?.setErrors({ incorrecto: true });
      }
    });
  }

  logout(){
    this.userlog=null;
    this.loginForm.reset();
    this.loginError = false;
    this.logged = false;
    this.administrador = false;
    this.uidManual = null;
    this.qrData = '';
    this.ocultarService.setBoolean(this.logged);

    Swal.fire({
      icon: 'info',
      title: 'Sesión cerrada',
      timer: 1500,
      showConfirmButton:false,
      color: 'black'
    });
    this.router.navigate(['/home'])
  }

  mostrarLog() {
    if (this.logged || this.administrador) {
      Swal.fire({
        title: 'Sesión activa',
        text: `Hola ${this.userlog}`,
        showCancelButton: true,
        confirmButtonText: 'Cerrar sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'black',
        cancelButtonColor: 'gray',
        color: 'black'
      }).then((res) => {
        if (res.isConfirmed) {
          this.administrador = false;
          this.usuario = false;
          this.logout();
        }
      });
    } else {
      Swal.fire({
        title: 'Iniciar como:',
        html: `
          <button id="admin-btn" class="swal2-confirm swal2-styled" style="background-color: black; margin: 10px;">Administrador</button>
          <button id="user-btn" class="swal2-cancel swal2-styled" style="background-color: gray; margin: 10px;">Usuario</button>
        `,
        showConfirmButton: false,
        showCancelButton: false,
        color: 'black',
        didOpen: () => {
          document.getElementById('admin-btn')?.addEventListener('click', () => this.mostrarFormulario('admin'));
          document.getElementById('user-btn')?.addEventListener('click', () => this.mostrarFormulario('user'));
        }
      });
    }
  }


  mostrarFormulario(tipo: 'admin' | 'user') {
    Swal.fire({
      title: `Login ${tipo === 'admin' ? 'Administrador' : 'Usuario'}`,
      html: `
        <input type="text" id="username" class="swal2-input" placeholder="Usuario">
        <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
        <div id="error-msg" style="color: red; font-size: 0.9em; margin-top: 5px;"></div>
        ${tipo === 'user' ? `
            <button id="google-btn" class="swal2-confirm swal2-styled" style="background-color: #4285F4; margin-top: 10px;">Iniciar sesión con Google</button>
            <button id="phone-btn" class="swal2-confirm swal2-styled" style="background-color: #34A853; margin-top: 10px;">Iniciar sesión con teléfono</button>
        ` : ''}
      `,
      showCancelButton: true,
      cancelButtonText: 'Regresar',
      confirmButtonText: 'Ingresar',
      confirmButtonColor: 'black',
      cancelButtonColor: 'gray',
      focusConfirm: false,
      color: 'black',
      didOpen: () => {
        if (tipo === 'user') {
          const phoneBtn = document.getElementById('phone-btn');
          if (phoneBtn) {
            phoneBtn.addEventListener('click', (e) => {
              e.preventDefault();
              Swal.close();
              setTimeout(() => {
                this.mostrarFormularioTelefono();
              }, 0);
            });
          } 

          const googleBtn = document.getElementById('google-btn');
          if (googleBtn) {
            googleBtn.addEventListener('click', async (e) => {
              e.preventDefault();
              try {
                const cred = await this.authService.loginWithGoogle();
                const user = cred.user;

                await this.authService.guardarDatosUsuarioGoogle(user);
                Swal.close();

                this.usuario = true;
                this.logged = true;
                this.userlog = user.displayName || user.email || 'Usuario';
                this.ocultarService.setBoolean(this.logged);

                Swal.fire({
                  title: '¡Bienvenido!',
                  text: `Hola ${this.userlog}`,
                  icon: 'success',
                  confirmButtonColor: 'black',
                  color: 'black'
                });
              } catch (error) {
                console.error('Error en login con Google', error);
                Swal.fire({
                  title: 'Error',
                  text: 'Ocurrió un error al iniciar sesión con Google.',
                  icon: 'error',
                  confirmButtonColor: 'black',
                  color: 'black'
                });
              }
            });
          }
        }
      },
      preConfirm: async () => {
        const swalContainer = Swal.getPopup();
        const usernameInput = swalContainer?.querySelector('#username') as HTMLInputElement;
        const passwordInput = swalContainer?.querySelector('#password') as HTMLInputElement;
        const errorMsg = swalContainer?.querySelector('#error-msg') as HTMLElement;

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
          if (errorMsg) errorMsg.innerText = 'Por favor completa ambos campos';
          return false;
        }

        const datos = await this.authService.obtenerDatosUsuario(tipo, username);
        if (!datos) {
          if (errorMsg) errorMsg.innerText = 'El usuario no existe';
          return false;
        }

        if (datos.bloq) {
          if (errorMsg) errorMsg.innerText = 'Cuenta bloqueada por demasiados intentos';
          return false;
        }

        if (datos.password !== password) {
          const nuevosIntentos = (datos.intentos || 0) + 1;

          if (nuevosIntentos >= 3) {
            await this.authService.bloquearCuenta(tipo, datos.id);
            if (errorMsg) errorMsg.innerText = 'Cuenta bloqueada por demasiados intentos';
            Swal.fire({
              title: '¿Olvidaste tu contraseña?',
              text: '¿Quieres restablecer tu contraseña mediante correo?',
              showCancelButton: true,
              confirmButtonText: 'Sí, enviar enlace',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: 'black',
              cancelButtonColor: 'gray',
              color: 'black'
            }).then((res) => {
              if (res.isConfirmed) {
                this.mostrarRecuperarCuenta();
              }
            });
          } else {
            await this.authService.actualizarIntentosFallidos(tipo, datos.id, nuevosIntentos);
            if (errorMsg) errorMsg.innerText = `Credenciales incorrectas. Intentos restantes: ${3 - nuevosIntentos}`;
          }
          return false;
        }

        await this.authService.actualizarIntentosFallidos(tipo, datos.id, 0);
        return { username, password };
      }
    }).then((result) => {
      if (result.isDismissed) {
        this.mostrarLog();
      }

    if (result.isConfirmed && result.value) {
      this.userlog = result.value.username;

      if (tipo === 'user') {
        const usersRef = collection(this.firestore, 'usuarios');
        const q = query(usersRef, where('nombre', '==', result.value.username));
        getDocs(q).then(snapshot => {
          if (!snapshot.empty) {
            const docData = snapshot.docs[0];
            this.uidManual = docData.id;
            this.generarQR();
          }
        });
      } else {
        this.generarQR();
      }

      if (tipo === 'admin') {
        this.administrador = true;
      } else {
        this.usuario = true;
        this.logged = true;
        this.ocultarService.setBoolean(this.logged);
      }

      const uid = localStorage.getItem('uid');
      if (uid) {
        const ref = doc(this.firestore, tipo === 'admin' ? 'admins' : 'usuarios', uid);
        updateDoc(ref, {
          password: result.value.password,
          intentos: 0,
          bloq: false
        });
      }

      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola ${result.value.username}`,
        icon: 'success',
        confirmButtonColor: 'black',
        color: 'black'
      });
    }
    });
  }

  mostrarRecuperarCuenta() {
    Swal.fire({
      title: 'Recuperar cuenta',
      html: `
        <input type="email" id="email" class="swal2-input" placeholder="Correo asociado a tu cuenta">
        <div id="error-msg" style="color: red; font-size: 0.9em; margin-top: 5px;"></div>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar enlace',
      confirmButtonColor: 'black',
      cancelButtonColor: 'gray',
      focusConfirm: false,
      preConfirm: async () => {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const errorMsg = document.getElementById('error-msg');

        const email = emailInput.value.trim();

        if (!email) {
          if (errorMsg) errorMsg.innerText = 'Por favor escribe tu correo';
          return false;
        }

        try {
          await this.authService.enviarCorreoRecuperacion(email);
          return email;
        } catch (error) {
          if (errorMsg) errorMsg.innerText = 'No se pudo enviar el correo. Verifica que sea correcto.';
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire({
          title: 'Correo enviado',
          text: `Se ha enviado un enlace de recuperación a: ${result.value}`,
          icon: 'success',
          confirmButtonColor: 'black'
        });
      }
    });
  }

  mostrarFormularioTelefono() {
    Swal.fire({
      title: 'Iniciar sesión con teléfono',
      html: `
        <input type="text" id="phone-number" class="swal2-input" placeholder="Ej: +521234567890">
        <div id="recaptcha-container"></div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Enviar código',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'black',
      cancelButtonColor: 'gray',
      color: 'black',
      didOpen: async () => {
        await this.authService.configurarRecaptcha();
      },
      preConfirm: async () => {
        const phoneInput = document.getElementById('phone-number') as HTMLInputElement;
        const phone = phoneInput.value.trim();
        if (!phone) return false;
        try {
          await this.authService.enviarCodigoTelefono(phone);
          return phone;
        } catch (err) {
          console.error('Error enviando código:', err);
          Swal.showValidationMessage('Número no registrado');
          return false;
        }
      }
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        this.mostrarFormularioCodigo();
      }
    });
  }

  mostrarFormularioCodigo() {
    Swal.fire({
      title: 'Verifica el código',
      html: `<input type="text" id="code" class="swal2-input" placeholder="Código recibido">`,
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'black',
      cancelButtonColor: 'gray',
      color: 'black',
      preConfirm: async () => {
        const codeInput = document.getElementById('code') as HTMLInputElement;
        const code = codeInput?.value?.trim();

        if (!code) {
          Swal.showValidationMessage('Ingresa el código recibido');
          return false;
        }

        try {
          const cred = await this.authService.verificarCodigo(code);
          this.usuario = true;
          this.logged = true;
          this.userlog = cred.user.phoneNumber;
          this.ocultarService.setBoolean(true);
          Swal.fire({
            title: '¡Bienvenido!',
            text: `Hola ${this.userlog}`,
            icon: 'success',
            confirmButtonColor: 'black',
            color: 'black'
          });
          return true;
        } catch (err) {
          console.error('Error verificando código:', err);
          Swal.showValidationMessage('Código incorrecto');
          return false;
        }
      }
    });
  }
}