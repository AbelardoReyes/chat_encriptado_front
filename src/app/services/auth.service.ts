import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.API_URL;
  SOCKET_URL = environment.SOCKET_URL;
  private route = 'auth';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${this.route}/login`, credentials);
  }
  register(credentials: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${this.route}/register`, credentials);
  }
  logout(): Observable<any> {
    return this.http.get(`${this.API_URL}/${this.route}/logout`);
  }
  me(): Observable<any> {
    // Obtén el token de autenticación desde donde lo tengas (por ejemplo, un servicio de autenticación)
    const token = localStorage.getItem('token'); // Reemplaza esto con tu token de autenticación

    // Crea un objeto HttpHeaders y agrega el token como un encabezado personalizado
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Aquí asumimos que estás usando un token tipo Bearer
    });

    // Configura la solicitud HTTP con las cabeceras personalizadas
    const options = { headers: headers };

    // Realiza la solicitud HTTP con las cabeceras configuradas
    return this.http.get(`${this.API_URL}/${this.route}/me`, options);
  }
}
