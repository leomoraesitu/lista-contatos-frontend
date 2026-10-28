import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  it('renderiza a tela de contatos e carrega a lista pela API', async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
    }).compileComponents();

    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    http.expectOne('http://127.0.0.1:8080/contatos').flush([]);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('app-contatos')).not.toBeNull();
    expect(element.textContent).toContain('LISTA DE CONTATOS');
    expect(element.querySelector('form')).not.toBeNull();
    http.verify();
  });
});
