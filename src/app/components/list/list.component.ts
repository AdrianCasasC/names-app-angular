import { Component, inject, output } from '@angular/core';
import { NameService } from '../../services/name.service';
import { bookGifBase64 } from '../../constants/base64.constant';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NgClass } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { Name } from '../../models/names.model';
import { PunctuationService } from '../../services/punctuation.service';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NzCollapseModule,
    NzSwitchModule,
    NzPaginationModule,
    NgClass,
    FormsModule,
    NzIconModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly _nameService = inject(NameService);
  private readonly _punctuationService = inject(PunctuationService);
  private readonly _notificationService = inject(NotificationService);

  /* Outputs */
  deleteConfirm = output<{id: string, name: string}>();
  
  filter = this._nameService.filter;
  groupLoading = this._nameService.groupLoading;
  groupedNames = this._nameService.groupedNames;
  isLoadingName = this._nameService.isLoadingName;
  isLoadingMap = this._nameService.isLoadingMap;

  /* variables */
  book64path: string = bookGifBase64;
  private startX = 0;
  private currentX = 0;
  private distance = 0;
  private base = 0;
  private isDragging = false;
  private threshold = 60;

  private getPunctuation(): void {
    this._punctuationService.getPunctuation().subscribe();
  }

  private getAllNames(): void {
    this._nameService.getAllNames(this.filter()).subscribe();
  }

  private getClientX(event: TouchEvent | MouseEvent): number {
    return event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
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

  onTouchStart(event: TouchEvent | MouseEvent, i: number, j: number) {
    this.isDragging = true;
    this.startX = this.getClientX(event);
    this.base = this.groupedNames()[i].list[j].transform || 0
  }

  onTouchMove(event: TouchEvent | MouseEvent, i: number, j: number) {
    if (!this.isDragging) return;
    this.currentX = this.getClientX(event);
    
    const diffX = this.currentX - this.startX + this.base;

    if (diffX > 0) return
    
    this._nameService.updateTransformNamePosition(diffX, i, j);
    
  }

  onTouchEnd(i: number, j: number) {
    this.isDragging = false;
    this.distance = this.groupedNames()[i].list[j].transform || 0;

    if (this.distance <= -this.threshold) {
      // Keep bin revealed
      this._nameService.updateTransformNamePosition(-this.threshold, i, j);
    } else {
      // Return to original position
      this._nameService.updateTransformNamePosition(0, i, j);
    }
  }

  onShowDeleteConfirmModal(selectedDeleteName: {id: string, name: string}): void {
    this.deleteConfirm.emit(selectedDeleteName)
  }

}
