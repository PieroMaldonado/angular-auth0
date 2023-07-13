import { Component } from '@angular/core';
import { EmisorService } from '../shared/emisor.service';
import { DomSanitizer } from '@angular/platform-browser';  
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent {

  centroCostos: any[] = [];
  datos: any;
  codigo: number | undefined;
  descripcion: string | undefined;
  busqueda: string = '';
  nuevosResultados: boolean = false;
  logoUrl:any;


  constructor(private emisorService: EmisorService,private sanitizer: DomSanitizer, private http: HttpClient,private router: Router) {
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl('assets/img/logo-taller.svg');  

   }

  buscarCentroCostos() {
    this.http.get<any[]>(`/api/ControladorAPI/api/centrocostos/search?descripcionCentroCostos=${this.busqueda}`).subscribe(
      (resultados) => {
        this.centroCostos = resultados;
        console.log(this.centroCostos);
        Swal.fire('Se encontró Centro Costo')
        this.nuevosResultados = true;
        if(this.centroCostos===null)
        {
          Swal.fire('No se encontró Centro Costo')
        }
      },
      (error) => {
        console.log(error);
        Swal.fire('No se encontró Centro Costo')
      }
    );

  }

  
}
