import { Component, inject, OnInit } from '@angular/core';
import { NameService } from '../../services/name.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

/** NgZorro */
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { GroupedName, Name } from '../../models/names.model';
import { Filter } from '../../models/request.model';
import { bookGifBase64 } from '../../constants/base64.constant';
import { NgClass } from '@angular/common';
import { PunctuationService } from '../../services/punctuation.service';
import { ModalComponent } from '../../components/modal/modal.component';

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
    NzPaginationModule,
    NgClass,
    ModalComponent,
    ReactiveFormsModule,
    NzDatePickerModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  /* Injections */
  private readonly _nameService = inject(NameService);
  private readonly _punctuationService = inject(PunctuationService);
  private readonly _fb = inject(FormBuilder);

  /* Signals */
  //name = this._nameService.name;
  groupedNames = this._nameService.groupedNames;
  isLoadingName = this._nameService.isLoadingName;
  isLoadingMap = this._nameService.isLoadingMap;
  groupLoading = this._nameService.groupLoading;
  filter = this._nameService.filter;
  punctuationAdri = this._punctuationService.punctuationAdri;
  punctuationElena = this._punctuationService.punctuationElena;

  /* variables */
  book64path: string = bookGifBase64;
  searchValue: string = '';
  counter: number = 1000;
  interval: any;
  openAddModal = false;
  newDate: Date | null = null;
  nameForm: FormGroup = this._fb.group({
    name: ['', Validators.required],
    meaning: [''],
    details: [''],
    date: [''],
    
  })

  private getAllNames(): void {
    this._nameService.getAllNames(this.filter()).subscribe();
  }

  private setCounter(duration: number): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.counter = 1000;
    this.interval = setInterval(() => {
      this.counter -= duration;
    
      if (this.counter < 0) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this._nameService.getAllNames(this.filter()).subscribe({
          next: (resp: GroupedName[]) => this.counter = 1000
        });
      }
    }, duration);
  }

  private getPunctuation(): void {
    this._punctuationService.getPunctuation().subscribe();
  }

  private init(): void {
    this.getAllNames();
    this.getPunctuation();
  }

  ngOnInit(): void {
    this.init();
  }

  onSearchName(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.searchValue = value;
    this._nameService.updateFilters({...this.filter(), coincidence: value});
    this.setCounter(250);
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

  onSetAddModalState(state: 'open' | 'close'): void {
    this.openAddModal = state === 'open';
  }

  onReloadNames(): void {
    this.init();
  }

  onSubmitAddForm(): void {
    if (this.nameForm.invalid) return;
    const {name, meaning, details, date} = this.nameForm.value
    const newName: Name = {
      name,
      meaning,
      details,
      date,
      checkedByAdri: false,
      checkedByElena: false,
    }
    this._nameService.addName(newName).subscribe({
      next: () => {
        this.nameForm.reset();
        this.init();
      }
    });
  }

  onDateChange(selectedDate: Date): void {
    this.nameForm.patchValue({
      date: selectedDate
    })
  }

}
