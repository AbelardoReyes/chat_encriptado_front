import { HttpClient } from '@angular/common/http';
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

  constructor(private http:HttpClient) { }

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
    return this.http.get(`${this.API_URL}/${this.route}/me`);
  }
}
