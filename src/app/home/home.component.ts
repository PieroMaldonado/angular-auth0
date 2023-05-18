import { Component, OnInit } from '@angular/core';
import { EmisorService } from '../shared/emisor.service';
import { DomSanitizer } from '@angular/platform-browser';  
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  emisorNombre = '';
  emisorRuc = '';
  logoUrl:any;
  centroCostos: any[] = [];
  datos: any;
  codigo: number | undefined;
  descripcion: string | undefined;
  apiResponse: any;
  busqueda: string = '';
  nombreBusqueda: string = '';
  mostrarFormularioCentroCostos = false;
  fechaActual: string;
  mostrarMovimientosPlanilla: boolean = false;
  

  constructor(public auth: AuthService,private emisorService: EmisorService,private sanitizer: DomSanitizer, private http: HttpClient,private router: Router) {
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl('assets/img/logo-taller.svg');  
    this.fechaActual = new Date().toLocaleDateString();  
  }

  ngOnInit(): void {
    const emisorData = this.emisorService.getEmisorData();
    this.emisorNombre = emisorData.nombre;
    this.emisorRuc = emisorData.ruc;
  }

  CentroCostos(): void {
    this.mostrarFormularioCentroCostos = true;
    this.mostrarMovimientosPlanilla = false;
  }

  MovimientoPlanilla(): void {
    this.mostrarMovimientosPlanilla = true;
    this.mostrarFormularioCentroCostos = false;
  }

  cerrarSesionAPP(){
    this.auth.logout()
    this.emisorService.clearEmisorData();  
    this.router.navigate(['/']);  
  }
  
  onlyLettersAndNumbers(event: KeyboardEvent): void {
    const input = event.key;
    const isLetterOrNumber = /^[a-zA-Z0-9]+$/.test(input);
    const isAllowedKey = event.code === 'Backspace' || event.code === 'Delete' || event.code === 'Tab' || event.code === 'Space';
  
    if (!isLetterOrNumber && !isAllowedKey) {
      event.preventDefault();
    }
  }
  
  onlyNumbers(event: KeyboardEvent): void {
    const input = event.key;
    const isNumber = /^[0-9]+$/.test(input);
    const isAllowedKey = event.code === 'Backspace' || event.code === 'Delete' || event.code === 'Tab';
  
    if (!isNumber && !isAllowedKey) {
      event.preventDefault();
    }
  }
  
}
