import { inject, Injectable, signal } from '@angular/core';
import { GroupedName, Name, PaginatedNames } from '../models/names.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { finalize, map, Observable, tap } from 'rxjs';
import { Filter } from '../models/request.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  /* Injections */
  private readonly _http = inject(HttpClient);
  private readonly _notificationService = inject(NotificationService);

  /* Signals*/
  private _name = signal<Name | null>(null);
  private _editedName = signal<Name | null>(null);
  private _groupedNames = signal<GroupedName[] | []>([]);
  private _isLoadingName = signal<boolean>(false);
  private _isLoadingMap = signal<Map<string, boolean>>(new Map());
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
  isLoadingMap = this._isLoadingMap.asReadonly();
  groupLoading = this._groupLoading.asReadonly();
  filter = this._filter.asReadonly();

  /* Variables */
  apiUrl = environment.apiUrl;

  getNameInfoByByName(name: string): Observable<Name> {
    this._isLoadingName.set(true);
    return this._http.get<Name>(`${this.apiUrl}/names/${name}`)
      .pipe(
        map((name: Name) => {
          this._name.set(name);
          return name;
        }),
        finalize(() => this._isLoadingName.set(false))
      );
  }

  updateName(id: string, name: Partial<Name>): Observable<Name> {
    this._isLoadingMap.update(prev => prev.set(id, true));
    return this._http.put<Name>(`${this.apiUrl}/names/${id}`, name)
      .pipe(map((name: Name) => {
        this._editedName.set(name);
        return name;
      }),
      finalize(() => this._isLoadingMap.update(prev => {
        prev.delete(id);
        return prev;
      }))
    );
  }

  getAllNames({ coincidence, page, pageSize }: Filter): Observable<GroupedName[]> {
    this._groupLoading.set(true);
    const params: Record<string, any> = { coincidence, page, pageSize }
    return this._http.get<PaginatedNames>(`${this.apiUrl}/names`, { params })
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

  addName(newName: Name): Observable<Name> {
    const mapKey = 'post_name';
    this._isLoadingMap.update(prev => prev.set(mapKey, true));
    return this._http.post<Name>(`${this.apiUrl}/names`, newName)
    .pipe(
      tap(() => this._notificationService.createNotification({
        icon: 'success',
        type: 'success',
        message: '¡Nombre  guardado! ✅'
      })),
      finalize(() => this._isLoadingMap.update(prev => {
        prev.delete(mapKey);
        return prev;
      })
      )
  )
  }
}
