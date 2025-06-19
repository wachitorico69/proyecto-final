import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private backendUrl = 'https://proyecto-final-node-y03d.onrender.com';

  constructor(private http: HttpClient) {}

  createOrder(data: { correo: string }) {
    return this.http.post<{ url: string }>(this.backendUrl+'/pay', data);
  }
}
