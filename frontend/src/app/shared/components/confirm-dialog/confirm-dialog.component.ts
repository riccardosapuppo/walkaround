import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

/** Una domanda, e le parole che portano i due bottoni. */
export interface ConfirmDialogData {
  /** Il titolo, scritto come la domanda che è. */
  titolo: string;

  /** Cosa comporta farlo, quando non si capisce dal titolo. */
  dettaglio?: string;

  /** La parola sul bottone che lo fa. Mai «OK»: vedi la nota qui sotto. */
  conferma: string;

  /** Se l'azione distrugge qualcosa, il bottone lo dice anche col colore. */
  distrugge?: boolean;

  /**
   * La parola sul bottone che non fa niente.
   *
   * Un parametro e non una costante perche' questa finestra serve anche pagine
   * tradotte: la dashboard e' in italiano, il profilo e' in sei lingue, e un
   * «Annulla» fisso accanto a un titolo in tedesco e' peggio del riquadro del
   * browser, che almeno la lingua del browser ce l'aveva.
   */
  annulla?: string;
}

/**
 * Chiedere prima di fare una cosa che non si torna indietro.
 *
 * ── Perché esiste, invece di `window.confirm` ────────────────────────────────
 *
 * Undici domande venivano poste con il riquadro del browser -- dieci nella
 * dashboard e una nel profilo -- ed erano l'unico punto in cui questa
 * applicazione lo faceva: `MatDialog` è già usato in cinque posti, **compreso
 * lo stesso file** in cui stavano le dieci. Non era una scelta, era una svista
 * rimasta lì.
 *
 * Undici e non tre, che è il numero riferito la prima volta: il censimento era
 * stato fatto con un `head` in fondo al comando, e un elenco troncato somiglia
 * a un elenco corto.
 *
 * E un `confirm` nativo è l'unico pezzo di un'applicazione web che
 * l'applicazione non scrive: arriva nel carattere del sistema operativo, sul
 * grigio del sistema operativo, nella lingua del browser e non in quella della
 * pagina, appeso sotto la barra degli indirizzi.
 *
 * ── I due bottoni ────────────────────────────────────────────────────────────
 *
 * «OK» accanto ad «Annulla» sono due parole che non nominano niente: chi legge
 * deve tenere la domanda in testa e ricostruire da che parte sta il sì, e
 * quello che distrugge indossa il colore e la posizione della scelta sicura.
 * Un bottone che dice **Elimina** accanto a uno che dice **Annulla** è un
 * bottone che nessuno preme per sbaglio.
 *
 * ── Sagomato come ciò che sostituisce ────────────────────────────────────────
 *
 * `window.confirm` restituisce un booleano, e ogni chiamata qui leggeva
 * `const confirmed = window.confirm(...); if (!confirmed) return;`. Questo
 * restituisce una promessa di booleano, così quelle righe sono diventate
 * `const confirmed = await ConfirmDialogComponent.chiedi(this.dialog, {...});`
 * — la stessa frase, la stessa forma, e nessuna macchina a stati da infilare
 * dentro un componente da quattromila righe.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(
    readonly dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) readonly dati: ConfirmDialogData
  ) {}

  /**
   * Apre la domanda e aspetta la risposta.
   *
   * @param dialog Il servizio già iniettato nel componente che chiede.
   * @param dati Cosa chiedere.
   * @returns `true` se hanno detto di sì.
   */
  static async chiedi(dialog: MatDialog, dati: ConfirmDialogData): Promise<boolean> {
    const aperto = dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: dati,
        width: 'min(28rem, calc(100vw - 2rem))',
        autoFocus: 'dialog',
        restoreFocus: true,
        panelClass: 'confirm-dialog-panel'
      }
    );

    // Chiudere col tasto Esc o cliccando fuori restituisce `undefined`, che qui
    // vuol dire no: una domanda a cui non si è risposto non è un sì.
    return (await firstValueFrom(aperto.afterClosed())) === true;
  }
}
