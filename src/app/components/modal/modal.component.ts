import { Component, inject, input, output, TemplateRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ClickOutsideDirective, NgTemplateOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  /* Injections */
  private readonly _fb = inject(FormBuilder);

  /* Inputs */
  show = input<boolean>(false);
  showCloseIcon = input<boolean>(false);
  ignoreElementsByClass = input<string[]>([]);
  ignoreElementsById = input<string[]>([]);
  content = input.required<TemplateRef<any>>();
  

  /* Outputs */
  closeModal = output<void>();

  onCloseModal(): void {
    if (this.show()) {
      this.closeModal.emit();
    }
  }
}
