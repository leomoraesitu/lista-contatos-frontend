import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ContatosComponent } from './contatos.component';
import { Contato } from './contato.model';

describe('ContatosComponent', () => {
  let component: ContatosComponent;
  let fixture: ComponentFixture<ContatosComponent>;
  let http: HttpTestingController;

  const url = 'http://127.0.0.1:8080/contatos';

  const dados = {
    name: 'Ana Silva',
    email: 'ana@example.com',
    telefone: '11900000000',
    endereco: 'Rua Exemplo, 100',
    cidade: 'Itu',
    cep: '13300000',
    estado: 'SP',
  };

  const ana: Contato = { id: 1, ...dados };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContatosComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ContatosComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const request = http.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush([{ ...ana }]);

    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('mantém um cadastro após pesquisar e limpar o filtro', () => {
    const novo: Contato = {
      ...ana,
      id: 2,
      name: 'Bruno Souza',
    };

    component.filtroPesquisa = 'Ana Silva';
    component.filtrarContatos();
    component.formGroupContato.setValue({
      ...dados,
      name: novo.name,
    });

    component.save();

    const request = http.expectOne(url);
    expect(request.request.method).toBe('POST');
    request.flush(novo);

    expect(component.contatos.map((c) => c.id)).toEqual([1]);

    component.filtroPesquisa = 'Bruno';
    component.filtrarContatos();
    expect(component.contatos.map((c) => c.id)).toEqual([2]);

    component.filtroPesquisa = '';
    component.filtrarContatos();
    expect(component.contatos.map((c) => c.id)).toEqual([1, 2]);
  });

  it('não restaura um contato excluído ao limpar o filtro', () => {
    component.filtroPesquisa = 'Ana';
    component.filtrarContatos();

    component.delete(component.contatos[0]);

    const request = http.expectOne(`${url}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, {
      status: 204,
      statusText: 'No Content',
    });

    component.filtroPesquisa = '';
    component.filtrarContatos();

    expect(component.todosContatos).toEqual([]);
    expect(component.contatos).toEqual([]);
  });

  it('aplica a edição somente após a confirmação da API', () => {
    component.edit(component.contatos[0]);
    component.formGroupContato.patchValue({
      name: 'Ana Atualizada',
    });

    component.save();

    const request = http.expectOne(`${url}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.name).toBe('Ana Atualizada');

    expect(component.todosContatos[0].name).toBe('Ana Silva');
    expect(component.isSaving).toBeTrue();

    request.flush(null);

    expect(component.todosContatos[0].name)
      .toBe('Ana Atualizada');
    expect(component.isSaving).toBeFalse();
    expect(component.isEditing).toBeFalse();
  });

  it('preserva lista e formulário quando a edição falha', () => {
    component.edit(component.contatos[0]);
    component.formGroupContato.patchValue({
      name: 'Ana Atualizada',
    });

    component.save();

    http.expectOne(`${url}/1`).flush(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    expect(component.todosContatos[0].name).toBe('Ana Silva');
    expect(component.formGroupContato.get('name')?.value)
      .toBe('Ana Atualizada');
    expect(component.isEditing).toBeTrue();
    expect(component.isSaving).toBeFalse();

    fixture.detectChanges();

    const alert: HTMLElement | null =
      fixture.nativeElement.querySelector('[role="alert"]');

    expect(alert?.textContent)
      .toContain('Não foi possível atualizar o contato');
  });

  it('não duplica o cadastro enquanto a requisição está pendente', () => {
    component.formGroupContato.setValue(dados);

    component.save();
    component.save();

    // expectOne falha se houver duas requisições.
    const request = http.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(component.isSaving).toBeTrue();

    request.flush({ ...ana, id: 2 });

    expect(component.todosContatos.length).toBe(2);
    expect(component.isSaving).toBeFalse();
  });

  it('não envia um formulário inválido', () => {
    component.save();

    http.expectNone(url);

    expect(component.submited).toBeTrue();
    expect(component.isSaving).toBeFalse();
  });

  it('encerra a edição do contato excluído sem limpar a pesquisa', () => {
    component.filtroPesquisa = 'Ana';
    component.filtrarContatos();
    component.edit(component.contatos[0]);

    component.delete(component.contatos[0]);

    http.expectOne(`${url}/1`).flush(null, {
      status: 204,
      statusText: 'No Content',
    });

    expect(component.isEditing).toBeFalse();
    expect(component.formGroupContato.get('name')?.value)
      .toBeNull();
    expect(component.filtroPesquisa).toBe('Ana');
    expect(component.contatos).toEqual([]);
    expect(component.isSaving).toBeFalse();
  });

  it('preserva o cadastro após falha e permite uma nova tentativa', () => {
    component.formGroupContato.setValue(dados);
    component.save();
    http.expectOne(url).flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.formGroupContato.getRawValue()).toEqual(dados);
    expect(component.todosContatos).toEqual([ana]);
    expect(component.isSaving).toBeFalse();
    expect(component.errorMessage).toContain('cadastrar');

    component.save();
    expect(component.errorMessage).toBe('');
    http.expectOne(url).flush({ ...ana, id: 2 });
    expect(component.todosContatos.length).toBe(2);
    expect(component.isSaving).toBeFalse();
  });

  it('preserva contato e edição quando a exclusão falha', () => {
    component.edit(component.contatos[0]);
    component.formGroupContato.patchValue({ name: 'Nome em edição' });
    component.delete(component.contatos[0]);
    http.expectOne(`${url}/1`).flush(null, { status: 500, statusText: 'Server Error' });

    expect(component.todosContatos).toEqual([ana]);
    expect(component.isEditing).toBeTrue();
    expect(component.formGroupContato.get('name')?.value).toBe('Nome em edição');
    expect(component.errorMessage).toContain('remover');
    expect(component.isSaving).toBeFalse();
  });

  it('preserva a edição atual ao excluir outro contato', () => {
    const outro = { ...ana, id: 2, name: 'Bruno Souza' };
    component.todosContatos = [ana, outro];
    component.filtrarContatos();
    component.edit(ana);
    component.formGroupContato.patchValue({ name: 'Rascunho' });
    component.delete(outro);
    http.expectOne(`${url}/2`).flush(null);

    expect(component.todosContatos).toEqual([ana]);
    expect(component.isEditing).toBeTrue();
    expect(component.selectedContato.id).toBe(ana.id);
    expect(component.formGroupContato.get('name')?.value).toBe('Rascunho');
  });

  it('cancela uma edição sem modificar os dados originais', () => {
    component.edit(component.contatos[0]);
    component.formGroupContato.patchValue({ name: 'Rascunho' });
    component.filtroPesquisa = 'Ana';
    component.errorMessage = 'Erro anterior';
    component.cancel();

    expect(component.todosContatos).toEqual([ana]);
    expect(component.contatos).toEqual([ana]);
    expect(component.isEditing).toBeFalse();
    expect(component.formGroupContato.get('name')?.value).toBeNull();
    expect(component.filtroPesquisa).toBe('');
    expect(component.errorMessage).toBe('');
    http.expectNone(() => true);
  });

  it('reaplica o filtro quando uma edição deixa de corresponder à pesquisa', () => {
    component.filtroPesquisa = 'Ana Silva';
    component.filtrarContatos();
    component.edit(component.contatos[0]);
    component.formGroupContato.patchValue({ name: 'Bruno Souza' });
    component.save();
    http.expectOne(`${url}/1`).flush(null);

    expect(component.contatos).toEqual([]);
    component.filtroPesquisa = '';
    component.filtrarContatos();
    expect(component.contatos[0].name).toBe('Bruno Souza');
  });

  it('bloqueia ações concorrentes enquanto a edição está pendente', () => {
    component.edit(component.contatos[0]);
    component.formGroupContato.patchValue({ name: 'Nome atualizado' });
    component.save();
    component.save();
    component.delete(ana);
    component.edit({ ...ana, id: 2 });
    component.cancel();

    const request = http.expectOne(`${url}/1`);
    expect(request.request.method).toBe('PUT');
    http.expectNone(() => true);
    expect(component.isEditing).toBeTrue();
    expect(component.selectedContato.id).toBe(1);
    expect(component.formGroupContato.get('name')?.value).toBe('Nome atualizado');
    request.flush(null);
    expect(component.isSaving).toBeFalse();
  });

  it('não envia exclusões duplicadas enquanto aguarda a API', () => {
    component.delete(ana);
    component.delete(ana);
    const request = http.expectOne(`${url}/1`);
    expect(request.request.method).toBe('DELETE');
    expect(component.todosContatos).toEqual([ana]);
    request.flush(null);
    expect(component.todosContatos).toEqual([]);
    expect(component.isSaving).toBeFalse();
  });

  it('desabilita os controles durante a requisição e os libera após erro', () => {
    component.formGroupContato.setValue(dados);
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const fieldset: HTMLFieldSetElement = form.querySelector('fieldset')!;
    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('table button, .mb-3 > button')
    );
    expect(fieldset.disabled).toBeTrue();
    expect(form.querySelector('button[type="submit"]')?.textContent).toContain('Aguarde');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => expect(button.disabled).toBeTrue());

    http.expectOne(url).flush(null, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fieldset.disabled).toBeFalse();
    buttons.forEach((button) => expect(button.disabled).toBeFalse());
    expect(form.querySelector('button[type="submit"]')?.textContent).toContain('Salvar');
  });

  it('mostra falha de carregamento sem substituir a lista existente', () => {
    component.ngOnInit();
    http.expectOne(url).flush(null, { status: 503, statusText: 'Unavailable' });
    fixture.detectChanges();

    expect(component.todosContatos).toEqual([ana]);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('Não foi possível carregar os contatos');
  });

  it('pesquisa todos os campos ignorando espaços externos e maiúsculas', () => {
    for (const termo of Object.values(dados)) {
      component.filtroPesquisa = `  ${termo.toUpperCase()}  `;
      component.filtrarContatos();
      expect(component.contatos).withContext(termo).toEqual([ana]);
    }
    component.filtroPesquisa = 'inexistente';
    component.filtrarContatos();
    expect(component.contatos).toEqual([]);
  });
});
