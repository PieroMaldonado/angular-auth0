import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { InsertarComponent } from './insertar/insertar.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { FilterPipe } from './pipes/filter.pipe';
import { EditarComponent } from './editar/editar.component';
import { MovimientoPlanillaComponent } from './movimiento-planilla/movimiento-planilla.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthGuard } from './auth.guard';
import { CentroCostosComponent } from './centro-costos/centro-costos.component';
// Import the module from the SDK
import { AuthModule } from '@auth0/auth0-angular';  


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    InsertarComponent,
    BusquedaComponent,
    FilterPipe,
    EditarComponent,
    MovimientoPlanillaComponent,
    CentroCostosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-0giiekio4xgysadj.us.auth0.com',
      clientId: 'vW93ZzH7weegQxsxzL6rpEnavYng17iH',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://crudempresasapi.azurewebsites.net/',
      },
    }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
