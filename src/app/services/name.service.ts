import { inject, Injectable, signal } from '@angular/core';
import { Name } from '../models/names.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  /* Injections */
  private _http: HttpClient = inject(HttpClient);

  /* Signals*/
  private _name = signal<Name | null>(null)
  name = this._name.asReadonly();

  getNameById(id: string): Observable<Name> {
    return this._http.get<Name>(environment.apiUrl + '/names/' + id)
    .pipe(map(x => {
      const name: Name = {
        id: x.id,
        name: x.name,
        date: x.date,
        checked: x.checked,
        meaning: x.meaning,
        details: x.details
      };
      this._name.set(name);
      return name;
    }));
  }
}
