import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target;
    if (input.value.length === input.maxLength) {
      const form = input.form;
      const index = Array.prototype.indexOf.call(form, input);
      if (index < form.elements.length - 1) {
        form.elements[index + 1].focus();
      }
    }
  }
}
