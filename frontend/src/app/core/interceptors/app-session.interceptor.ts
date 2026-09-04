import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppAuthService } from '../services/app-auth.service';

/**
 * Il token di sessione, allegato a ogni chiamata verso il nostro backend.
 *
 * PERCHE' ESISTE, ED E' UNA LEZIONE.
 *
 * Sei rotte prendevano l'identita' dell'utente da un `userId` scritto nella
 * query o nel corpo — un uuid generato dal browser — e non guardavano nessun
 * token: bastava cambiare quel numero per leggere gli acquisti di un altro,
 * cancellarglieli o attaccarsi al suo codice hotel. Sono state chiuse, e li'
 * il difetto e' finito.
 *
 * Ma chiudere una porta rompe chi ci passava. Il frontend il token non lo
 * mandava su nessuna delle sei, perche' non gli era mai servito: le uniche
 * due chiamate che lo allegavano erano quelle che il controllo ce l'avevano
 * gia'. Aggiungere l'header a sei posti e ricordarsene alla settima rotta e'
 * la stessa specie di soluzione che ha creato il problema: una regola tenuta
 * a mente invece che dal codice.
 *
 * Quindi sta qui, una volta sola, e vale anche per le rotte che non esistono
 * ancora. Chi scrive la prossima chiamata non deve sapere niente di questo
 * file.
 *
 * TRE COSE CHE NON FA, E PERCHE'.
 *
 * 1. Non tocca le chiamate che gia' portano un `Authorization`. La dashboard
 *    ha una sessione sua, di un'altra tabella (`dashboard_sessions`), e la
 *    simulazione di sblocco manda apposta quel token: sovrascriverlo con
 *    quello dell'app trasformerebbe una funzione dell'amministratore in un
 *    401 senza spiegazione.
 * 2. Non esce da `environment.apiBaseUrl`. Un token allegato a una richiesta
 *    verso un altro dominio — le tessere della mappa, per dire — e' un
 *    segreto regalato a chi non c'entra.
 * 3. Non aggiunge niente se la sessione non c'e'. Gli ospiti senza account
 *    esistono e comprano: le rotte pubbliche devono continuare a rispondere.
 *
 * NOTA SULL'INIEZIONE. `AppAuthService` chiede `HttpClient`, e `HttpClient`
 * chiede gli interceptor: chiederlo nel costruttore chiuderebbe il cerchio e
 * Angular fallirebbe all'avvio. Si passa dall'`Injector` e lo si risolve al
 * momento della prima richiesta, quando ormai `HttpClient` esiste.
 */
@Injectable()
export class AppSessionInterceptor implements HttpInterceptor {
  private appAuth?: AppAuthService;

  constructor(private readonly injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiBaseUrl) || request.headers.has('Authorization')) {
      return next.handle(request);
    }

    if (!this.appAuth) {
      this.appAuth = this.injector.get(AppAuthService);
    }

    const token = this.appAuth.session?.token;
    if (!token) {
      return next.handle(request);
    }

    return next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
}
