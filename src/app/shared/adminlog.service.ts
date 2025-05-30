import { Injectable } from '@angular/core';
import { adminlog } from '../adminacc';
import { ADMINLOG } from '../admins';

@Injectable({
  providedIn: 'root'
})
export class AdminlogService {
  private adminlogs: adminlog[]=ADMINLOG;
  constructor() { }

  obtenerU(username: string, password: string){
    return this.adminlogs.find(
      user => user.username === username && user.password === password
    );
  }
}
