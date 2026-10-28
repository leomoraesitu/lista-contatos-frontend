import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContatoService } from './contato.service';
import { Contato } from './contato.model';

describe('ContatoService', () => {
  let service: ContatoService;
  let http: HttpTestingController;
  const url = 'http://127.0.0.1:8080/contatos';
  const dados = {
    name: 'Ana Silva', email: 'ana@example.com', telefone: '11900000000',
    endereco: 'Rua Exemplo, 100', cidade: 'Itu', cep: '13300000', estado: 'SP',
  };
  const contato: Contato = { id: 1, ...dados };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ContatoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista contatos por GET', () => {
    let resultado: Contato[] | undefined;
    service.getContatos().subscribe((value) => resultado = value);
    const request = http.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush([contato]);
    expect(resultado).toEqual([contato]);
  });

  it('cadastra por POST e recebe o identificador gerado', () => {
    let resultado: Contato | undefined;
    service.save(dados as Contato).subscribe((value) => resultado = value);
    const request = http.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(dados);
    request.flush(contato, { status: 201, statusText: 'Created' });
    expect(resultado).toEqual(contato);
  });

  it('atualiza por PUT e aceita resposta sem corpo', () => {
    let concluido = false;
    service.update(contato).subscribe({ complete: () => concluido = true });
    const request = http.expectOne(`${url}/1`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(contato);
    request.flush(null);
    expect(concluido).toBeTrue();
  });

  it('exclui por DELETE e aceita resposta 204', () => {
    let concluido = false;
    service.delete(contato).subscribe({ complete: () => concluido = true });
    const request = http.expectOne(`${url}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(concluido).toBeTrue();
  });

  it('propaga erros HTTP para o consumidor', () => {
    let status: number | undefined;
    service.update(contato).subscribe({ error: (error) => status = error.status });
    http.expectOne(`${url}/1`).flush(null, { status: 404, statusText: 'Not Found' });
    expect(status).toBe(404);
  });
});
