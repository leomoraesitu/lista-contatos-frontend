import { Component } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from '../Model/contato';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent {

contatos : Contato[] = [];

constructor(private contatoService : ContatoService){}

ngOnInit(): void {
  this.contatoService.getContatos().subscribe(
    {
      next : contatos => this.contatos = contatos
    }
  )
}

}
