import { Component } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from '../Model/contato';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css'],
})
export class ContatosComponent {
  contatos: Contato[] = [];
  formGroupContato: FormGroup;
  isEditing: boolean = false;
  submited: boolean = false;
  selectedContato: Contato = {} as Contato;

  constructor(private contatoService: ContatoService,
              private formBuilder: FormBuilder
              ) {
                this.formGroupContato = formBuilder.group({
                  name: [''],
                  email: [''],
                  telefone: [''],
                  endereco: [''],
                  cidade: [''],
                  cep: [''],
                  estado: ['']
                })
              }

  ngOnInit(): void {
    this.contatoService.getContatos().subscribe({
      next: (contatos) => (this.contatos = contatos),
    })
  }

  save(){
    let contato = this.formGroupContato.value;
    this.contatoService.save(contato).subscribe(
      {
        next: contato => this.contatos.push(contato)
      }
    )
  }

  delete(contato: Contato){
    this.contatoService.delete(contato).subscribe({
      next: () => {
            this.contatos = this.contatos.filter(c => c.id !== contato.id)
        }
    })
  }

  cancel() {
    this.formGroupContato.reset();
    this.isEditing = false;
    this.submited = false;
  }
}


