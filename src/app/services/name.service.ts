import { inject, Injectable, signal } from '@angular/core';
import { GroupedName, Name, PaginatedNames } from '../models/names.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { finalize, map, Observable, tap } from 'rxjs';
import { Filter } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  /* Injections */
  private _http: HttpClient = inject(HttpClient);

  /* Signals*/
  private _name = signal<Name | null>(null);
  private _editedName = signal<Name | null>(null);
  private _groupedNames = signal<GroupedName[] | []>([]);
  private _isLoadingName = signal<boolean>(false);
  private _groupLoading = signal<boolean>(false);
  private _filter = signal<Filter>({
    coincidence: '',
    page: 1,
    pageSize: 10,
    total: 0,
  })

  name = this._name.asReadonly();
  editedName = this._editedName.asReadonly();
  groupedNames = this._groupedNames.asReadonly();
  isLoadingName = this._isLoadingName.asReadonly();
  groupLoading = this._groupLoading.asReadonly();
  filter = this._filter.asReadonly();

  getNameInfoByByName(name: string): Observable<Name> {
    this._isLoadingName.set(true);
    return this._http.get<Name>(environment.apiUrl + '/names/' + name)
      .pipe(
        map((name: Name) => {
          this._name.set(name);
          return name;
        }),
        finalize(() => this._isLoadingName.set(false))
      );
  }

  updateName(id: string, name: Partial<Name>): Observable<Name> {
    return this._http.put<Name>(environment.apiUrl + '/names/' + id, name)
      .pipe(map((name: Name) => {
        this._editedName.set(name);
        return name;
      }));
  }

  getAllNames({ coincidence, page, pageSize }: Filter): Observable<GroupedName[]> {
    this._groupLoading.set(true);
    const params: Record<string, any> = { coincidence, page, pageSize }
    return this._http.get<PaginatedNames>(environment.apiUrl + '/names', { params })
      .pipe(
        map(({page, pageSize, total, groupedNames}: PaginatedNames) => {
          this._groupedNames.set(groupedNames);
          this._filter.update(prev => ({...prev, page, pageSize, total}))
          return groupedNames;
        }),
        finalize(() => this._groupLoading.set(false))
      );
  }

  updateFilters(newFilter: Filter): void {
    this._filter.set(newFilter);
  }

  updateEditedName(name: Name) {
    const firstLetter = name.name[0].toUpperCase();
    this._groupedNames.update(prev => {
      const groupedIndex = prev.findIndex(prev => prev.letter === firstLetter )
      if (groupedIndex != -1) {
        const foundNameIndex = prev.find(prev => prev.letter === firstLetter )?.list.findIndex(groupedName => groupedName._id === name._id);
        if (foundNameIndex != -1) {
          prev[groupedIndex].list[foundNameIndex!] = name
        }
      }
      return prev;
    })
  }

  // getGroupedNames({ coincidence, page, pageSize }: Filter): Observable<GroupedName[]> {
  //   this._groupLoading.set(true);
  //   const params: Record<string, any> = { coincidence, page, pageSize }
  //   return this._http.get<GroupedName[]>(environment.apiUrl + '/names/grouped', { params })
  //     .pipe(
  //       map((names: GroupedName[]) => {
  //         this._groupedNames.set(names);
  //         return names;
  //       }),
  //       finalize(() => this._groupLoading.set(false))
  //     );
  // }
}
