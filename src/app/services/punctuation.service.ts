import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Punctuation } from '../models/punctuation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PunctuationService {
  /* Injections */
  private readonly _http = inject(HttpClient);

  /* Signals */
  private _punctuationAdri = signal<Punctuation | null>(null);
  private _punctuationElena = signal<Punctuation | null>(null);
  punctuationAdri = this._punctuationAdri.asReadonly();
  punctuationElena = this._punctuationElena.asReadonly();

  getPunctuation(): Observable<Punctuation[]> {
    return this._http.get<Punctuation[]>(`${environment.apiUrl}/punctuation`)
    .pipe(
      tap((resp) => {
        this._punctuationAdri.set(resp[0]);
        this._punctuationElena.set(resp[1]);
      })
    )
  }
}
