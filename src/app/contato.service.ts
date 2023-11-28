import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contato } from './Model/contato';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  contatos: any;
  baseUrl: string = "http://localhost:3000/contatos";

  constructor(private http: HttpClient) { 

  }

  getContatos():Observable<Contato[]>{
    return this.http.get<Contato[]>(this.baseUrl);
  }

  save(contato: Contato): Observable<Contato>{
    return this.http.post<Contato>(this.baseUrl, contato);
  }

  delete(contato: Contato):Observable<void> {
    let url = `${this.baseUrl}/${contato.id}`;
    return this.http.delete<void>(url);
  }

  update(contato: Contato): Observable<Contato>{
    let url = `${this.baseUrl}/${contato.id}`;
    return this.http.put<Contato>(url, contato);
  }
}
