import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from 'models';

@Component({
  selector: 'ui-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent {

  @Input() task!: Task;
  @Output() toggle = new EventEmitter<String>();
  @Output() delete = new EventEmitter<String>();
  @Output() edit = new EventEmitter<Task>();
}
