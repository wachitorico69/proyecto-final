import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ClasesComponent } from './clases/clases.component';
import { SobretiComponent } from './sobreti/sobreti.component';
import { RegistrosComponent } from './registros/registros.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent },
    { path: 'nosotros', component: NosotrosComponent },
    { path: 'clases', component: ClasesComponent },
    { path: 'sobreti', component: SobretiComponent },
    { path: 'registros', component: RegistrosComponent }
];
