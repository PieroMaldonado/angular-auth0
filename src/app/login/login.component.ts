import { Component, OnInit } from '@angular/core';  
import { EmisorService } from '../shared/emisor.service';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Router } from '@angular/router';  
import { DomSanitizer } from '@angular/platform-browser';  
import Swal from 'sweetalert2';  
// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit{  
  emisores: any;  
  selectedEmisor: string;  
  mensajeError: any;  
  username!: string;    
  password!: string;   
  emisorComp: any;   
  logoUrl:any;  

  httpOptions = {  
    headers: new HttpHeaders({  
      'Content-Type': 'application/json',  
      'Access-Control-Allow-Origin': 'https://angular-auth0.vercel.app/',  
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',  
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',  
      'Access-Control-Allow-Credentials': 'true',  
      'Access-Control-Allow-Policy': 'AllowSpecificOrigin'  
    })  
  };  
  
  minLength = {    
    username: 4,    
    password: 5    
  };    
     
  constructor(public auth: AuthService, private http: HttpClient,private sanitizer: DomSanitizer,private emisorService: EmisorService,private router: Router) {   
    this.selectedEmisor= '';  
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl('assets/img/logo-taller.svg');    
  }  
  
  onlyNumbers(event: KeyboardEvent, maxLength: number) {        
    const isAllowedKey = event.code === 'Backspace' || event.code === 'Delete' || event.code === 'Tab';        
    const isMaxLengthReached = (event.target as HTMLInputElement).value.length >= maxLength;      
    const isNumberKey = /^\d+$/.test(event.key); // Utiliza la sintaxis \d para verificar si la tecla presionada es un número
    
    if (!isAllowedKey && (!isNumberKey || isMaxLengthReached)) { // Actualiza esta línea para verificar si la tecla no es permitida o si se alcanzó la longitud máxima  
      event.preventDefault();        
    }        
  }  

  ngOnInit() {  
    this.auth.isAuthenticated$.subscribe(isAuthenticated =>{
      if(isAuthenticated){
        this.router.navigate(['/home'])
      }
    })

    // this.http.get<any>('https://aspnetback.azurewebsites.net/api/ControladorAPI/api/v1/emisores')    
    this.http.get<any>('api/ControladorAPI/api/v1/emisores')    
        .subscribe((data: any[]) => {    
          this.emisores = data.map(emisor => emisor.NombreEmisor);   
        });      
  }  

  
  login(){
    this.auth.loginWithRedirect()
  }
    
  onChangeEmisor(event: Event) {  
    const target = event.target as HTMLSelectElement;  
    const selectedIndex = target.selectedIndex;  
    const emisorId = target.options[selectedIndex].value;  
    const emisorNombre = target.options[selectedIndex].textContent;  
    this.emisorComp = emisorNombre;  
    this.selectedEmisor = emisorId;  
  }  
  
  loggedIn = false;  
  
onSubmit() {  
  if (!this.username || !this.password || !this.emisorComp) {  
    Swal.fire('Error');  
    return;  
  }  
  
  const loginData = {  
    usuario: this.username,  
    contrasena: this.password  
  };  
  
  this.http.post('api/ControladorAPI/login', loginData)  
    .subscribe(response => {  
      const data = JSON.stringify(response);  
      const responseObj = JSON.parse(data);  
  
      const emisorData = {  
        nombre: responseObj[0].NOMBREEMISOR.trim(),  
        ruc: responseObj[0].RucUsuario,  
        OBSERVACION: responseObj[0].OBSERVACION
      };  
  
      if (this.emisorComp === emisorData.nombre && emisorData.OBSERVACION === 'INGRESO EXITOSO') {  
        Swal.fire('Inicio exitoso!');  
        this.emisorService.updateEmisorData(emisorData);  
        this.router.navigate(['/home']);  
        this.loggedIn = true; // actualiza el estado de inicio de sesión del usuario  
      } else {  
        Swal.fire('Error');  
      }  
    }, error => {  
      console.log(error);  
      Swal.fire('Error');  
    });  
}  
}  
