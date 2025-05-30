import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private apiUrl = 'https://clase.free.beeceptor.com';

  constructor(private http: HttpClient) {}

  getClases(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
