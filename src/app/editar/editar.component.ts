import { Component, OnInit } from '@angular/core';
import { EmisorService } from '../shared/emisor.service';
import { DomSanitizer } from '@angular/platform-browser';  
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent {

  codigo: any;
  nombreCentroCostos: any;
  centroCostos: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient,private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codigo = Number(params.get('id'));
      // Aquí puedes hacer una llamada al API para obtener la información del centro de costo con este ID y llenar los campos correspondientes en el formulario.
    });
  }

  guardarCambios(): void {
    const url = `/api/ControladorAPI/CentroCostosEdit?codigoCentroCostos=${this.codigo}&descripcionCentroCostos=${this.nombreCentroCostos}`;
    
    const body = { codigoCentroCostos: this.codigo, descripcionCentroCostos: this.nombreCentroCostos };
    this.http.get(url).subscribe(
      (response) => {
        console.log(response);
        Swal.fire('Se ha editado exitosamente');
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error(error);
        Swal.fire('¡Error!');
        this.router.navigate(['/home']);
      }
    );
  }

}
