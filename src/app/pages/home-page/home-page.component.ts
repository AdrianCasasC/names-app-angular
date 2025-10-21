import { Component, inject, OnInit } from '@angular/core';
import { NameService } from '../../services/name.service';
import { FormsModule } from '@angular/forms';

/** NgZorro */
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { GroupedName, Name } from '../../models/names.model';
import { Filter } from '../../models/request.model';
import { bookGifBase64 } from '../../constants/base64.constant';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    FormsModule,
    NzSwitchModule,
    NzCollapseModule,
    NzIconModule,
    NzSelectModule,
    NzSpinModule,
    NzPaginationModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  /* Injections */
  private readonly _nameService = inject(NameService);

  /* Signals */
  //name = this._nameService.name;
  groupedNames = this._nameService.groupedNames;
  isLoadingName = this._nameService.isLoadingName;
  groupLoading = this._nameService.groupLoading;
  filter = this._nameService.filter;

  /* variables */
  searching: boolean = false;
  book64path: string = bookGifBase64;
  searchValue: string = '';

  private getAllNames(): void {
    this._nameService.getAllNames(this.filter()).subscribe();
  }

  ngOnInit(): void {
    this.getAllNames();
  }

  onSearchName(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    if (this.searching) {
      this.searchValue = value;
      return;
    };
    this.searching = true;
    this._nameService.updateFilters({...this.filter(), coincidence: this.searchValue})
    setTimeout(() => {
      this._nameService.getAllNames(this.filter()).subscribe({
        next: (resp: GroupedName[]) => this.searching = false
      });
    }, 1000);
  }

  onGetNameInfoByName(name: string): void {
    this._nameService.getNameInfoByByName(name).subscribe({
      next: (resp) => console.log("Respuesta get by name: ", resp)
    })
  }

  onPageIndexChange(newPage: number): void {
    this._nameService.updateFilters({...this.filter(), page: newPage});
    this.getAllNames();
  }

  onPageSizeChanges(newPageSize: number): void {
    this._nameService.updateFilters({...this.filter(), pageSize: newPageSize});
    this.getAllNames();
  }

  onSwitchChange(nameId: string, identity: 'Adri' | 'Elena', value: boolean) {
    const checked = {
      [identity === 'Adri' ? "checkedByAdri" : "checkedByElena"]: value
    } 
    this._nameService.updateName(nameId, checked).subscribe({
      next: (resp: Name) => this._nameService.updateEditedName(resp)
    })
  }
}
