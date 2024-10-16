import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective {
  @Input() appAutoFocus: boolean = true;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (!this.appAutoFocus) return;

    const input = event.target;
    if (input.type === 'number' && input.value.length === 2) {
      const form = input.form;
      const index = Array.prototype.indexOf.call(form, input);
      if (index < form.elements.length - 1) {
        const nextElement = form.elements[index + 1];
        if (nextElement.type === 'number') {
          nextElement.focus();
        }
      }
    }
  }
}
