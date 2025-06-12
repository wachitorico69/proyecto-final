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

  async validarUsuario(username: string, password: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'usuarios');
    const q = query(usersRef, where('nombre', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Obtén el primer documento (suponiendo que hay solo uno)
      const usuarioEncontrado = querySnapshot.docs[0];
      const usuarioData = usuarioEncontrado.data();

      // Guarda el ID del documento en localStorage
      localStorage.setItem('uid', usuarioEncontrado.id);

      // Opcional: también puedes guardar otros datos si quieres
      // localStorage.setItem('nombre', usuarioData.nombre);

      return true;  // usuario encontrado y contraseña correcta
    } else {
      return false; // no encontrado
    }
  }
  async validarAdmin(username: string, password: string): Promise<boolean> {
    const adminsRef = collection(this.firestore, 'admins');
    const q = query(adminsRef, where('nombre', '==', username), where('password', '==', password));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Obtén el primer documento (suponiendo que hay solo uno)
      const adminEncontrado = querySnapshot.docs[0];
      const adminData = adminEncontrado.data();

      // Guarda el ID del documento en localStorage
      localStorage.setItem('uid', adminEncontrado.id);

      return true;
    } else {
      return false;
    }
  }

  generarQR() {
    const id = localStorage.getItem('uid');
    if (id) {
      this.qrService.getUsuarioPorId(id).subscribe(data => {
        this.qrData = JSON.stringify(data);
        this.cargando = false;
      });
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
    const user = this.adminService.obtenerU(username, password);
    if (user) {
      this.userlog = user.nombre;
      this.loginError = false;
      this.logged = true;
      this.ocultarService.setBoolean(true);
    } else {
      this.loginError = true;
      this.loginForm.get('username')?.setErrors({ incorrecto: true });
      this.loginForm.get('password')?.setErrors({ incorrecto: true });
    }
  }
  logout(){
    this.userlog=null;
    this.loginForm.reset();
    this.loginError = false;
    this.logged = false;
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
    if (this.userlog) {
      this.logout();
      this.administrador = false;
      this.usuario = false;
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
          const adminBtn = document.getElementById('admin-btn');
          const userBtn = document.getElementById('user-btn');

          adminBtn?.addEventListener('click', () => {
            this.mostrarFormulario('admin');
          });

          userBtn?.addEventListener('click', () => {
            this.mostrarFormulario('user');
          });
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
      `,
      showCancelButton: true,
      cancelButtonText: 'Regresar',
      confirmButtonText: 'Ingresar',
      confirmButtonColor: 'black',
      cancelButtonColor: 'gray',
      focusConfirm: false,
      color: 'black',
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
}
