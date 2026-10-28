import { Component } from '@angular/core';
import { ContatoService } from './contato.service';
import { Contato } from './contato.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css'],
})
export class ContatosComponent {
  isSaving = false;
  errorMessage = '';
  todosContatos: Contato[] = [];
  contatos: Contato[] = [];

  formGroupContato: FormGroup;
  isEditing: boolean = false;
  submited: boolean = false;
  selectedContato: Contato = {} as Contato;
  filtroPesquisa: string = '';


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
      next: (contatos) => {
        this.todosContatos = [...contatos]; // Armazena todos os contatos para referência
        this.filtrarContatos();
      },
      error: () => {
        this.errorMessage =
          'Não foi possível carregar os contatos. Recarregue a página para tentar novamente.';
      },
    });
  }

  filtrarContatos(): void {
    const termo = this.filtroPesquisa.trim();

    this.contatos = termo
      ? this.todosContatos.filter((contato) =>
        this.contatoContainsSearchTerm(contato, termo)
      )
      : [...this.todosContatos];
  }

  contatoContainsSearchTerm(contato: Contato, termo: string): boolean {
    termo = termo.toLowerCase();
    return (
      contato.name.toLowerCase().includes(termo) ||
      contato.email.toLowerCase().includes(termo) ||
      contato.telefone.toLowerCase().includes(termo) ||
      contato.endereco.toLowerCase().includes(termo) ||
      contato.cidade.toLowerCase().includes(termo) ||
      contato.cep.toLowerCase().includes(termo) ||
      contato.estado.toLowerCase().includes(termo)
    );
  }




  save(): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.submited = true;

    if (this.formGroupContato.invalid) {
      return;
    }

    this.isSaving = true;

    if (this.isEditing) {
      const contatoAtualizado: Contato = {
        ...this.selectedContato,
        ...this.formGroupContato.getRawValue(),
      };

      this.contatoService
        .update(contatoAtualizado)
        .pipe(finalize(() => (this.isSaving = false)))
        .subscribe({
          next: () => {
            this.todosContatos = this.todosContatos.map((contato) =>
              contato.id === contatoAtualizado.id
                ? contatoAtualizado
                : contato
            );

            this.filtrarContatos();
            this.formGroupContato.reset();
            this.isEditing = false;
            this.submited = false;
          },
          error: () => {
            this.errorMessage =
              'Não foi possível atualizar o contato. Tente novamente.';
          },
        });

      return;
    }

    this.contatoService
      .save(this.formGroupContato.getRawValue())
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (contato) => {
          this.todosContatos = [...this.todosContatos, contato];
          this.filtrarContatos();
          this.formGroupContato.reset();
          this.submited = false;
        },
        error: () => {
          this.errorMessage =
            'Não foi possível cadastrar o contato. Tente novamente.';
        },
      });
  }

  delete(contato: Contato): void {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.isSaving = true;

    this.contatoService
      .delete(contato)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.todosContatos = this.todosContatos.filter(
            (item) => item.id !== contato.id
          );
          if (this.isEditing && this.selectedContato.id === contato.id) {
            this.formGroupContato.reset();
            this.isEditing = false;
            this.submited = false;
            this.selectedContato = {} as Contato;
          }
          this.filtrarContatos();
        },
        error: () => {
          this.errorMessage =
            'Não foi possível remover o contato. Tente novamente.';
        },
      });
  }

  cancel() {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.formGroupContato.reset();
    this.isEditing = false;
    this.submited = false;
    this.filtroPesquisa = ''; // Limpar o filtro ao cancelar
    this.filtrarContatos();
  }

  edit(contato: Contato) {
    if (this.isSaving) {
      return;
    }

    this.errorMessage = '';
    this.selectedContato = { ...contato };
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
