import { Component, inject } from '@angular/core';
import { NameService } from '../../services/name.service';
import { bookGifBase64 } from '../../constants/base64.constant';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NgClass } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Name } from '../../models/names.model';
import { PunctuationService } from '../../services/punctuation.service';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NzCollapseModule,
    NzSwitchModule,
    NzPaginationModule,
    NgClass,
    FormsModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly _nameService = inject(NameService);
  private readonly _punctuationService = inject(PunctuationService);
  
  filter = this._nameService.filter;
  groupLoading = this._nameService.groupLoading;
  groupedNames = this._nameService.groupedNames;
  isLoadingName = this._nameService.isLoadingName;
  isLoadingMap = this._nameService.isLoadingMap;

  /* variables */
  book64path: string = bookGifBase64;

  private getPunctuation(): void {
    this._punctuationService.getPunctuation().subscribe();
  }

  private getAllNames(): void {
    this._nameService.getAllNames(this.filter()).subscribe();
  }

  onSwitchChange(nameId: string, identity: 'Adri' | 'Elena', value: boolean, name: string) {
    const body = {
      [identity === 'Adri' ? "checkedByAdri" : "checkedByElena"]: value,
      name
    } 
    this._nameService.updateName(nameId, body).subscribe({
      next: (resp: Name) => {
        this._nameService.updateEditedName(resp);
        this.getPunctuation();
      }
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

}
