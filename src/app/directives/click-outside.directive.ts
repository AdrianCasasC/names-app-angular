import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Input('clickOutsideIgnoreById') ignoreElementsIdList: string[] = [];
  @Input('clickOutsideIgnoreByClass') ignoreElementsClassList: string[] = [];
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    const ignoreIdElements: HTMLElement[] = this.ignoreElementsIdList
      .map((id) => document.getElementById(id) as HTMLElement)
      .filter((element) => element !== null && element !== undefined);
    const ignoreClassElements: HTMLCollectionOf<Element>[] = this.ignoreElementsClassList
      .map((clss) => {
        return document.getElementsByClassName(clss);
      })
    const ignoreElements = [...ignoreIdElements];
    ignoreClassElements.forEach(elem => {
      for (let i = 0; i < elem.length; i++) {
        const classElem = elem.item(i);
        if (classElem instanceof HTMLElement) {
          ignoreElements.push(classElem);
        }
      }
    })
    if (
      targetElement &&
      !this.elementRef.nativeElement.contains(targetElement) &&
      !ignoreElements.some((el) => el.contains(targetElement))
    ) {
      this.clickOutside.emit();
    }
  }
}
