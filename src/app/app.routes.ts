import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ClasesComponent } from './clases/clases.component';
import { SobretiComponent } from './sobreti/sobreti.component';
import { RegistrosComponent } from './registros/registros.component';
import { UneteComponent } from './unete/unete.component';
import { GraficaComponent } from './grafica/grafica.component';
import { RecpassComponent } from './recpass/recpass.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent },
    { path: 'nosotros/:image', component: NosotrosComponent },
    { path: 'clases', component: ClasesComponent },
    { path: 'sobreti', component: SobretiComponent },
    { path: 'registros', component: RegistrosComponent },
    { path: 'grafica', component: GraficaComponent },
    { path: 'unete', component: UneteComponent },
    { path: 'reset', component: RecpassComponent }
];
