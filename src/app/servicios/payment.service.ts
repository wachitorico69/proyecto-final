import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  createOrder(data: { correo: string }) {
    return this.http.post<{ url: string }>(this.backendUrl+'/pay', data);
  }
}
