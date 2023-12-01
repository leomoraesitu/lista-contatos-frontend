import { Component } from '@angular/core';
import { ContatoService } from '../contato.service';
import { Contato } from '../Model/contato';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
                  name: ['', [Validators.required, Validators.minLength(3)]],
                  email: ['', [Validators.required, Validators.minLength(3)]],
                  telefone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
                  endereco: ['', [Validators.required, Validators.minLength(3)]],
                  cidade: ['', [Validators.required, Validators.minLength(3)]],
                  cep: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
                  estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
                })
              }

  ngOnInit(): void {
    this.contatoService.getContatos().subscribe({
      next: (contatos) => (this.contatos = contatos),
    })
  }

  
  save(){

    this.submited = true;

    if (this.formGroupContato.valid){ 

    if (this.isEditing){
      this.selectedContato.name = this.formGroupContato.get("name")?.value;
      this.selectedContato.email = this.formGroupContato.get("email")?.value;
      this.selectedContato.telefone = this.formGroupContato.get("telefone")?.value;
      this.selectedContato.endereco = this.formGroupContato.get("endereco")?.value;
      this.selectedContato.cidade = this.formGroupContato.get("cidade")?.value;
      this.selectedContato.cep = this.formGroupContato.get("cep")?.value;
      this.selectedContato.estado = this.formGroupContato.get("estado")?.value;

      this.contatoService.update(this.selectedContato).subscribe({
        next: () => {
          this.formGroupContato.reset();
          this.isEditing = false;
          this.submited = false;
          }
        }
      )
    }
    else{
      this.contatoService.save(this.formGroupContato.value).subscribe({
        next: (contato) => {
          this.contatos.push(contato);
          this.formGroupContato.reset();
          this.submited = false;
          }
        }
      )
    }  
  }
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

  edit(contato: Contato){
    this.selectedContato = contato;
    this.isEditing = true;
    this.formGroupContato.setValue(
      { 
        "name": contato.name, 
        "email": contato.email, 
        "telefone": contato.telefone, 
        "endereco": contato.endereco, 
        "cidade": contato.cidade, 
        "cep": contato.cep, 
        "estado": contato.estado
      }
    )
  }

  get name(): any {
      return this.formGroupContato.get("name");
  }

  get email(): any {
    return this.formGroupContato.get("email");
  }

  get telefone(): any {
    return this.formGroupContato.get("telefone");  
  }

  get endereco(): any {
    return this.formGroupContato.get("endereco");
  }

  get cidade(): any {
    return this.formGroupContato.get("cidade");
  }

  get cep(): any {
    return this.formGroupContato.get("cep");
  }

  get estado(): any {
    return this.formGroupContato.get("estado");
  }
}


