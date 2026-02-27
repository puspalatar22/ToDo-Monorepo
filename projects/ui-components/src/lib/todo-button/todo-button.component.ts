import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-todo-button',
  templateUrl: './todo-button.component.html',
  styleUrls: ['./todo-button.component.scss']
})
export class TodoButtonComponent  {
@Input() label='';
@Input() color: 'primary' | 'edit' | 'delete' | 'complete' = 'primary';
@Input() type : 'button' | 'submit' | 'reset' = 'button';
@Input() disabled = false;
@Output() click = new EventEmitter<MouseEvent>();
 @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation(); 
  }
}
