import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-centro-costos',
  templateUrl: './centro-costos.component.html',
  styleUrls: ['./centro-costos.component.css']
})
export class CentroCostosComponent {
  centroCostos: any[] = [];
  datosTablaOriginal: any[] = [];
  descripcionBusqueda: string = '';
  centroCostosBusqueda: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  token: string = ''
  rol: string[] = [];

  constructor(public auth: AuthService, private http: HttpClient) {} // Inyecta HttpClient en el constructor

  ngOnInit(): void {
    this.auth.getAccessTokenSilently().subscribe((value) => {
      this.token = value;
      this.obtenerRolToken();
      this.fetchCentroCostos();
    }, (error: any) => {
      console.log(error);
    });
  }
  
  obtenerRolToken() {
    this.auth.idTokenClaims$.subscribe((claims) => {
      if (claims) {
        this.rol = claims['rol'];
      }
    });
  }

  fetchCentroCostos(): void {
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('itemsPerPage', this.itemsPerPage.toString());

    const headers = this.setHeaders(this.token);
    
    this.http.get<any[]>('https://crudempresasapi.azurewebsites.net/api/ControladorAPI/api/v1/centrocostos', { params, headers }).subscribe(
      data => {
        this.centroCostos = data;
        this.datosTablaOriginal = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  //CRUD CENTRO COSTOS
  nuevoCentroCostos() {
    Swal.fire({
      title: 'Añadir nuevo Centro de Costos',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Código" onkeypress="onlyNumbers(event)" maxlength="5">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Descripción" onkeypress="onlyLettersAndNumbers(event)">',
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonText: 'Crear',
      allowOutsideClick: () => !Swal.isLoading(),
      didOpen: () => {
        const input1 = document.getElementById('swal-input1') as HTMLInputElement;
        input1.addEventListener('keypress', this.onlyNumbers);
        
        const input2 = document.getElementById('swal-input2') as HTMLInputElement;
        input2.addEventListener('keypress', this.onlyLettersAndNumbers);
      },
      preConfirm: () => {
        const codigo = (document.getElementById('swal-input1') as HTMLInputElement).value.toString().trim();
        const descripcion = (document.getElementById('swal-input2') as HTMLInputElement).value.trim();
        
        if (!codigo || !descripcion) {
          Swal.showValidationMessage('Ambos campos son requeridos');
          return false;
        }
        
        this.guardarNuevoCentroCostos(codigo, descripcion);
        return true; // Agregar esta línea
      },       
      willClose: () => {
        const input1 = document.getElementById('swal-input1') as HTMLInputElement;
        input1.removeEventListener('keypress', this.onlyNumbers);
        
        const input2 = document.getElementById('swal-input2') as HTMLInputElement;
        input2.removeEventListener('keypress', this.onlyLettersAndNumbers);
      }
    });
  } 
  
  guardarNuevoCentroCostos(codigo: string, descripcion: string) {
    if (codigo && descripcion) {
      const headers = this.setHeaders(this.token);
      const url = `https://crudempresasapi.azurewebsites.net/api/ControladorAPI/CentroCostosInsert?codigoCentroCostos=${codigo}&descripcionCentroCostos=${descripcion}`;
      this.http.get(url,{headers}).subscribe(
        (response) => {
          console.log(response);
          Swal.fire({
            title: 'Se ha ingresado exitosamente',
            icon: 'success',
            showCancelButton: false,
          }).then(() => {
            // Actualizar la tabla sin recargar la página
            this.fetchCentroCostos();
          });
        },
        (error) => {
          console.error(error);
          Swal.fire('¡Error!');
        }
      );
    }
  }

  editarCentroCostos(codigo: number): void {
    const centroCosto = this.centroCostos.find(cc => cc.Codigo === codigo);
  
    Swal.fire({
      title: 'Editar Centro de Costos',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Código" value="' + centroCosto.Codigo + '" readonly>' +
        '<input id="swal-input2" class="swal2-input" placeholder="Nombre Centro de Costos" value="' + centroCosto.NombreCentroCostos + '">',
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      allowOutsideClick: () => !Swal.isLoading(),
      didOpen: () => {
        const input2 = document.getElementById('swal-input2') as HTMLInputElement;
        input2.addEventListener('keypress', this.onlyLettersAndNumbers);
      },
      preConfirm: () => {
        const codigo = parseInt((document.getElementById('swal-input1') as HTMLInputElement).value, 10);
        const nombreCentroCostos = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!nombreCentroCostos) {
          Swal.showValidationMessage('El campo "Nombre Centro de Costos" es requerido');
          return false;
        }
        this.guardarCambiosCentroCostos(codigo, nombreCentroCostos);
        return true;
      },
      willClose: () => {
        const input2 = document.getElementById('swal-input2') as HTMLInputElement;
        input2.removeEventListener('keypress', this.onlyLettersAndNumbers);
      }
    });
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
    const isNumber = /^\d+$/.test(input);
    const isAllowedKey = event.code === 'Backspace' || event.code === 'Delete' || event.code === 'Tab';
  
    if (!isNumber && !isAllowedKey) {
      event.preventDefault();
    }
  }  

  getDescripcionCentroCostos(codigo: number): string {
    // Aquí haces una llamada al API para obtener el nombre del centro de costos con este código
    return this.centroCostos.find(cc => cc.Codigo === codigo)?.nombre || '';
  }

  guardarCambiosCentroCostos(codigo: number, nombre: string): void {
    const headers = this.setHeaders(this.token);
    const url = `https://crudempresasapi.azurewebsites.net/api/ControladorAPI/CentroCostosEdit?codigoCentroCostos=${codigo}&descripcionCentroCostos=${nombre}`;
    this.http.get(url,{headers}).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'Cambios guardados',
          icon: 'success',
          showCancelButton: false,
        }).then(() => {
          this.fetchCentroCostos();
        });
      },
      (error) => {
        console.error(error);
        Swal.fire('Error al guardar los cambios', '', 'error');
      }
    );
  }

  eliminarCentroCostos(codigo: number, descripcion: string) {
    const params = new HttpParams()
      .set('codigocentrocostos', codigo.toString())
      .set('descripcioncentrocostos', descripcion);
  
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro que desea eliminar el centro de costos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const headers = this.setHeaders(this.token);
        this.http.get('https://crudempresasapi.azurewebsites.net/api/ControladorAPI/api/centrocostos/delete', { params,headers }).subscribe(
          result => {
            console.log(result);
            Swal.fire('Se ha eliminado exitosamente').then(() => {
              this.fetchCentroCostos();
            });
          },
          error => {
            console.error(error);
            Swal.fire('Ocurrió un error al eliminar el centro de costos', '', 'error');
          }
        );
      }
    });
  }

  searchCentroCostos() {
    const descripcion = this.descripcionBusqueda;
    const headers = this.setHeaders(this.token);
    this.http.get<any[]>(`https://crudempresasapi.azurewebsites.net/api/ControladorAPI/api/centrocostos/search?descripcioncentrocostos=${descripcion}`,{headers}).subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.centroCostos = data;
          this.currentPage = 1;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No se encontraron resultados',
            text: 'No se encontraron datos para la búsqueda realizada.',
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  limpiarBusqueda() {
    this.descripcionBusqueda = '';
    this.centroCostos = this.datosTablaOriginal;
  }

  setHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

}
